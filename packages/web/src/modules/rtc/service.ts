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

export class RTCController {
  private room: string;
  private fromUserId: string;
  private toUserId: string;
  private rtcConfig: RTCConfiguration;
  // @ts-ignore - will be created in the constructor
  private rtcPeerConnection: RTCPeerConnection;
  private mediaStream: MediaStream | null;
  private handleTrack: (track?: RTCTrackEvent) => void;

  constructor(
    rtcConfig: RTCConfiguration,
    room: string,
    fromUserId: string,
    toUserId: string,
    handleTrack: (track?: RTCTrackEvent) => void,
  ) {
    this.room = room;
    this.fromUserId = fromUserId;
    this.toUserId = toUserId;
    this.rtcConfig = rtcConfig;
    this.handleTrack = handleTrack;

    this.mediaStream = null;
    this.createRTCPeerConnection();
  }

  setMediaStream(mediaStream: MediaStream) {
    this.mediaStream = mediaStream;
    this.syncRTCPeerConnectionTracks();
  }

  syncRTCPeerConnectionTracks() {
    if (!this.mediaStream) {
      this.handleTrack();
      this.rtcPeerConnection
        .getSenders()
        .forEach(track => this.rtcPeerConnection.removeTrack(track));
      return;
    }
    this.mediaStream
      .getTracks()
      .forEach(mediaStreamTrack =>
        this.rtcPeerConnection.addTrack(
          mediaStreamTrack,
          this.mediaStream as MediaStream,
        ),
      );
  }

  createRTCPeerConnection() {
    this.rtcPeerConnection = new RTCPeerConnection(this.rtcConfig);
    this.rtcPeerConnection.addEventListener(
      'icecandidate',
      this.handleOnIceEvent,
    );
    this.rtcPeerConnection.addEventListener(
      'negotiationneeded',
      this.handleOnNegotiationNeeded,
    );
    this.rtcPeerConnection.addEventListener('track', this.handleTrack);
    this.rtcPeerConnection.addEventListener('connectionstatechange', e => {
      if (
        (e.currentTarget as RTCPeerConnection).connectionState ===
        'disconnected'
      ) {
        this.createRTCPeerConnection();
      }
    });

    this.syncRTCPeerConnectionTracks();
  }

  async initiateOffer() {
    try {
      const offer = await this.rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await this.rtcPeerConnection.setLocalDescription(offer);

      if (!this.rtcPeerConnection.localDescription) {
        throw new Error('Failed to set local description');
      }

      this.emmitOffer(this.rtcPeerConnection.localDescription);
    } catch (error) {
      console.error(error);
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
    if (
      this.rtcPeerConnection.signalingState === 'stable' ||
      this.rtcPeerConnection.signalingState === 'closed'
    ) {
      this.createRTCPeerConnection();
    }

    await this.rtcPeerConnection.setRemoteDescription(message);
    const answer = await this.rtcPeerConnection.createAnswer();

    await this.rtcPeerConnection.setLocalDescription(answer);
    if (!this.rtcPeerConnection.localDescription) {
      throw new Error('Failed to set local description');
    }
    this.emmitAnswer(this.rtcPeerConnection.localDescription);
  };

  handleAnswer = (message: RTCSessionDescriptionInit) => {
    this.rtcPeerConnection.setRemoteDescription(message);
  };

  handleICECandidate = (message: string) => {
    const candidate = JSON.parse(message);

    this.rtcPeerConnection.addIceCandidate(candidate);
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

  // RTC controls
  init() {
    this.initiateOffer();
  }

  close() {
    this.rtcPeerConnection.close();
  }
}
