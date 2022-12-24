import { socket, services } from '@application';
import {
  Actions,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
  ConferencingAction,
} from '@chess-tent/types';
import { CONNECTION_CHANNEL_ID } from './constants';

export const isConferencingAction = (
  action: Actions,
): action is ConferencingAction =>
  [CONFERENCING_OFFER, CONFERENCING_ANSWER, CONFERENCING_ICECANDIDATE].some(
    actionType => actionType === action.type,
  );

const { logException } = services;

/**
 * RTCController is an abstraction above the RTCPeerConnection.
 * In a way it behaves like an adapter.
 *
 * Because of the dynamic relationship between two RTCPeers and the way React works,
 * the goal of controller is to stabilize references (methods, listeners, properties)
 * and do a cleanup in a standardised way for every RTCPeerConnection.
 *
 * Notable:
 *  - As RTC implementations aren't yet standardised across the browsers
 *  it is useful to create new RTCPeerConnection instance rather than recover it after
 *  the connection has been closed or interrupted.
 *  - onnegotiationneeded is called automatically when the new peer joins a room.
 *  Useful callback to reconcile two peers in the initial phase.
 *  It's also useful to detect changes in the connection (peer leaving and joining back).
 *  However, in ideal scenario wouldn't be needed. Two peers can communicate their way through the signaling server by sending offers and answers timely. This is notable because if needed the extra offer can be sent on the initialisation.
 *  Look at the commit diff.
 */
export class RTCController {
  private room: string;
  private fromUserId: string;
  private toUserId: string;
  private polite: boolean;
  private rtcConfig: RTCConfiguration;
  private makingOffer: boolean;
  private ignoreOffer: boolean;
  private settingRemoteDescription: boolean;
  // @ts-ignore - will be created in the constructor
  private rtcPeerConnection: RTCPeerConnection;
  // Used to track RTCPeerConnection connection status because the
  // event RTCPeerConnection connection event isn't implemented well in all browsers
  private rtcDataChannel?: RTCDataChannel;
  private mediaStream: MediaStream | null | undefined;
  private handleTrack: (track?: RTCTrackEvent) => void;

  constructor(
    rtcConfig: RTCConfiguration,
    room: string,
    fromUserId: string,
    toUserId: string,
    handleTrack: (track?: RTCTrackEvent) => void,
    polite: boolean,
  ) {
    this.makingOffer = false;
    this.ignoreOffer = false;
    this.room = room;
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.polite = polite;
    this.rtcConfig = rtcConfig;
    this.mediaStream = null;
    this.settingRemoteDescription = false;
    this.handleTrack = handleTrack;
    this.createRTCPeerConnection();
  }

  setMediaStream(mediaStream?: MediaStream) {
    this.mediaStream = mediaStream;
    this.syncRTCPeerConnectionTracks();
  }

  syncRTCPeerConnectionTracks() {
    this.rtcPeerConnection
      .getSenders()
      .forEach(sender => this.rtcPeerConnection.removeTrack(sender));

    if (!this.mediaStream) {
      return;
    }

    this.mediaStream.getTracks().forEach(mediaStreamTrack => {
      this.rtcPeerConnection.addTrack(
        mediaStreamTrack,
        this.mediaStream as MediaStream,
      );
    });
  }

  createRTCPeerConnection = () => {
    // cleanup previous listeners and connection state
    // @ts-ignore
    delete this.rtcPeerConnection;
    // Clear any possible tracks used from this peer
    this.handleTrack();

    this.rtcPeerConnection = new RTCPeerConnection(this.rtcConfig);

    // Add listeners to new instance
    this.rtcPeerConnection.addEventListener(
      'icecandidate',
      this.handleOnIceEvent,
    );
    this.rtcPeerConnection.addEventListener(
      'negotiationneeded',
      this.handleOnNegotiationNeeded,
    );
    this.rtcPeerConnection.addEventListener('track', this.handleTrack);
    this.rtcPeerConnection.addEventListener(
      'iceconnectionstatechange',
      this.handleIceConnectionStateChange,
    );

    this.syncRTCPeerConnectionTracks();
  };

  createDataChannel = () => {
    delete this.rtcDataChannel;

    this.rtcDataChannel = this.rtcPeerConnection.createDataChannel(this.room, {
      negotiated: true,
      id: CONNECTION_CHANNEL_ID,
    });

    this.rtcDataChannel.addEventListener('close', this.handleClose);
  };

  // Signaling server Actions
  emmitOffer(description: RTCSessionDescriptionInit) {
    socket.sendAction({
      type: CONFERENCING_OFFER,
      payload: {
        message: description,
        room: this.room,
        fromUserId: this.fromUserId,
        toUserId: this.toUserId,
      },
      meta: {},
    });
  }

  emmitAnswer(description: RTCSessionDescriptionInit) {
    socket.sendAction({
      type: CONFERENCING_ANSWER,
      payload: {
        message: description,
        room: this.room,
        fromUserId: this.fromUserId,
        toUserId: this.toUserId,
      },
      meta: {},
    });
  }

  emmitICECandidate(candidate: string) {
    socket.sendAction({
      type: CONFERENCING_ICECANDIDATE,
      payload: {
        message: candidate,
        room: this.room,
        fromUserId: this.fromUserId,
        toUserId: this.toUserId,
      },
      meta: {},
    });
  }

  // Signaling server listeners
  handleOffer = async (message: RTCSessionDescriptionInit) => {
    const readyForOffer =
      !this.makingOffer &&
      (this.rtcPeerConnection.signalingState === 'stable' ||
        !this.settingRemoteDescription);

    this.ignoreOffer = !readyForOffer && !this.polite;
    if (this.ignoreOffer) {
      return;
    }

    try {
      await this.rtcPeerConnection.setRemoteDescription(message);
    } catch (err) {
      logException(err as Error);
      return;
    }

    try {
      await this.rtcPeerConnection.setLocalDescription();
      this.emmitAnswer(
        this.rtcPeerConnection.localDescription as RTCSessionDescription,
      );
    } catch (e) {
      logException(e as Error);
    }
  };

  handleAnswer = async (message: RTCSessionDescriptionInit) => {
    try {
      this.settingRemoteDescription = true;
      await this.rtcPeerConnection.setRemoteDescription(message);
    } catch (e) {
      // Can happen during the negotiation.
      // Should automagically recover.
    } finally {
      this.settingRemoteDescription = false;
    }
  };

  handleICECandidate = async (message: string) => {
    const candidate = JSON.parse(message);

    try {
      await this.rtcPeerConnection.addIceCandidate(candidate);
    } catch (e) {
      if (!this.ignoreOffer) {
        logException(e as Error);
      }
    }
  };

  // RTC listeners
  handleOnIceEvent = (rtcPeerConnectionIceEvent: RTCPeerConnectionIceEvent) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icecandidate_event
    // can be empty string and that's fine
    if (rtcPeerConnectionIceEvent.candidate === null) {
      return;
    }
    this.emmitICECandidate(JSON.stringify(rtcPeerConnectionIceEvent.candidate));
  };

  handleOnNegotiationNeeded = async () => {
    try {
      this.makingOffer = true;
      await this.rtcPeerConnection.setLocalDescription();
      this.emmitOffer(
        this.rtcPeerConnection.localDescription as RTCSessionDescription,
      );
    } catch (err) {
      logException(err as Error);
    } finally {
      this.makingOffer = false;
    }
  };

  handleIceConnectionStateChange = (e: Event) => {
    if (this.rtcPeerConnection.iceConnectionState === 'failed') {
      this.rtcPeerConnection.restartIce();
    }

    // Creating data channel here because chrome sometimes closes exiting channel when a new connection is established.
    // This is unexpected behaviour that seems to be working better if a data channel is created only after peer connection is established.
    if (
      this.rtcPeerConnection.iceConnectionState === 'connected' &&
      (!this.rtcDataChannel ||
        this.rtcDataChannel?.readyState === 'closed' ||
        this.rtcDataChannel?.readyState === 'closing')
    ) {
      // Because the data channel can be in closing state, defer creating a new one.
      // The data channel should be closed before creating a new one because of the unique ID.
      // This still might not be enough. Better solution would be to change 'close' listener to reconnect.
      setTimeout(() => this.createDataChannel());
    }
  };

  handleClose = () => {
    if (!this.rtcDataChannel) {
      // Session destroyed by the user
      return;
    }

    // Session closed, prepare RTC for a new connection
    this.createRTCPeerConnection();
  };

  destroy() {
    delete this.rtcDataChannel;
    this.rtcPeerConnection.close();
  }
}
