import React, { Component } from 'react';
import {
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';

import { createMessage, createPayload } from './helpers';

// TODO: refactor into hook and add removal logic
// TODO: we only use message in payload
class PeerConnection extends Component {
  addMediaStreamTrack = async () => {
    const { localMediaStream, rtcPeerConnection } = this.props;

    if (localMediaStream) {
      await localMediaStream.getTracks().forEach(mediaStreamTrack => {
        rtcPeerConnection.addTrack(mediaStreamTrack);
      });
    }
  };

  handleOnNegotiationNeeded = async () => {
    const { activityId, sendMessage, rtcPeerConnection } = this.props;
    try {
      const offer = await rtcPeerConnection.createOffer();
      await rtcPeerConnection.setLocalDescription(offer);
      const payload = createPayload(
        activityId,
        undefined,
        rtcPeerConnection.localDescription,
      );
      const offerMessage = createMessage(CONFERENCING_OFFER, payload);
      sendMessage(JSON.stringify(offerMessage));
    } catch (error) {
      console.error('handleNegotiationNeeded Error: ', error);
    }
  };

  handleOnIceEvent = rtcPeerConnectionIceEvent => {
    if (rtcPeerConnectionIceEvent.candidate) {
      const { activityId, sendMessage } = this.props;
      const { candidate } = rtcPeerConnectionIceEvent;
      const payload = createPayload(
        activityId,
        undefined,
        JSON.stringify(candidate),
      );
      const iceCandidateMessage = createMessage(
        CONFERENCING_ICECANDIDATE,
        payload,
      );
      sendMessage(JSON.stringify(iceCandidateMessage));
    }
  };

  handleOnTrack = trackEvent => {
    const remoteMediaStream = new MediaStream([trackEvent.track]);
    this.props.addRemoteStream(remoteMediaStream);
  };

  componentDidMount() {
    const { rtcPeerConnection } = this.props;
    rtcPeerConnection.onnegotiationneeded = this.handleOnNegotiationNeeded;
    rtcPeerConnection.onicecandidate = this.handleOnIceEvent;
    rtcPeerConnection.ontrack = this.handleOnTrack;
  }

  componentDidUpdate(prevProps) {
    if (this.props.startConnection !== prevProps.startConnection) {
      this.addMediaStreamTrack();
    }
  }

  render() {
    return <></>;
  }
}

export default PeerConnection;
