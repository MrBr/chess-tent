import { socket } from '@application';
import {
  Actions,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
  ConferencingAction,
} from '@chess-tent/types';

export const isConferencingAction = (
  action: Actions,
): action is ConferencingAction =>
  [CONFERENCING_OFFER, CONFERENCING_ANSWER, CONFERENCING_ICECANDIDATE].some(
    actionType => actionType === action.type,
  );

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
  // @ts-ignore - will be created in the constructor
  private rtcPeerConnection: RTCPeerConnection;
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
    this.room = room;
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.polite = polite;
    this.rtcConfig = rtcConfig;
    this.handleTrack = handleTrack;

    this.mediaStream = null;
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
      this.handleTrack();
      return;
    }

    this.mediaStream.getTracks().forEach(mediaStreamTrack => {
      this.rtcPeerConnection.addTrack(
        mediaStreamTrack,
        this.mediaStream as MediaStream,
      );
    });
  }

  createRTCPeerConnection() {
    // @ts-ignore
    delete this.rtcPeerConnection;

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
      'connectionstatechange',
      this.handleConnectionStatusChange,
    );

    this.syncRTCPeerConnectionTracks();
  }

  async initiateOffer() {
    try {
      const offer = await this.rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      // Because createOffer is async this check is done after it's resolved to prevent
      // condition race
      if (this.rtcPeerConnection.signalingState !== 'stable') {
        return;
      }
      await this.rtcPeerConnection.setLocalDescription(offer);

      if (!this.rtcPeerConnection.localDescription) {
        throw new Error('Failed to set local description');
      }

      this.emmitOffer(this.rtcPeerConnection.localDescription);
    } catch (error) {
      if (this.rtcPeerConnection.signalingState === 'have-remote-offer') {
        const answer = await this.rtcPeerConnection.createAnswer();
        await this.rtcPeerConnection.setLocalDescription(answer);
      } else {
        console.log(error);
      }
    }
  }

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
    if (this.rtcPeerConnection.signalingState !== 'stable' && !this.polite) {
      if (
        this.rtcPeerConnection.signalingState === 'have-local-offer' &&
        this.rtcPeerConnection.localDescription
      ) {
        this.emmitOffer(this.rtcPeerConnection.localDescription);
      }
      return;
    }
    try {
      if (this.rtcPeerConnection.signalingState !== 'stable') {
        await this.rtcPeerConnection.setLocalDescription({ type: 'rollback' });
      }
      await this.rtcPeerConnection.setRemoteDescription(message);

      const answer = await this.rtcPeerConnection.createAnswer();

      await this.rtcPeerConnection.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }
    if (!this.rtcPeerConnection.localDescription) {
      throw new Error('Failed to set local description');
    }
    this.emmitAnswer(this.rtcPeerConnection.localDescription);
  };

  handleAnswer = async (message: RTCSessionDescriptionInit) => {
    await this.rtcPeerConnection.setRemoteDescription(message);
  };

  handleICECandidate = async (message: string) => {
    const candidate = JSON.parse(message);

    await this.rtcPeerConnection.addIceCandidate(candidate);
  };

  // RTC listeners
  handleOnIceEvent = (rtcPeerConnectionIceEvent: RTCPeerConnectionIceEvent) => {
    if (!rtcPeerConnectionIceEvent.candidate) {
      return;
    }
    this.emmitICECandidate(JSON.stringify(rtcPeerConnectionIceEvent.candidate));
  };

  handleOnNegotiationNeeded = () => {
    this.initiateOffer();
  };

  handleConnectionStatusChange = (e: Event) => {
    if (
      (e.currentTarget as RTCPeerConnection).connectionState === 'disconnected'
    ) {
      this.createRTCPeerConnection();
    }
  };

  close() {
    this.rtcPeerConnection.close();
  }
}
