import React, { Component } from 'react';
import 'core-js/stable';
import 'regenerator-runtime';

import { RTCVideo } from './RTCVideo';
import Websocket from './Websocket';
import PeerConnection from './PeerConnection';

import {
  DEFAULT_CONSTRAINTS,
  DEFAULT_ICE_SERVERS,
  TYPE_ROOM,
  TYPE_ANSWER,
} from './constants';

import { buildServers, createMessage, createPayload } from './helpers';

class RTCMesh extends Component {
  constructor(props) {
    super(props);

    const { mediaConstraints, iceServers } = props;
    // build iceServers config for RTCPeerConnection
    const iceServerURLs = buildServers(iceServers);

    this.state = {
      iceServers: iceServerURLs || DEFAULT_ICE_SERVERS,
      mediaConstraints: mediaConstraints || DEFAULT_CONSTRAINTS,
      localMediaStream: null,
      remoteMediaStream: null,
      roomKey: null,
      socketID: null,
      connectionStarted: false,
    };
    this.socket = new WebSocket(this.props.URL);
    this.rtcPeerConnection = new RTCPeerConnection({
      iceServers: this.state.iceServers,
    });
  }

  openCamera = async fromHandleOffer => {
    const { mediaConstraints, localMediaStream } = this.state;
    try {
      if (!localMediaStream) {
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints,
        );

        return fromHandleOffer === true
          ? mediaStream
          : this.setState({ localMediaStream: mediaStream });
      }
    } catch (error) {
      console.error('getUserMedia Error: ', error);
    }
  };

  handleOffer = async data => {
    const { localMediaStream, roomKey, socketID } = this.state;
    const { payload } = data;
    await this.rtcPeerConnection.setRemoteDescription(payload.message);
    let mediaStream = localMediaStream;

    if (!mediaStream) {
      mediaStream = await this.openCamera(true);
    }

    this.setState(
      { connectionStarted: true, localMediaStream: mediaStream },
      async function () {
        const answer = await this.rtcPeerConnection.createAnswer();
        await this.rtcPeerConnection.setLocalDescription(answer);
        const payload = createPayload(roomKey, socketID, answer);
        const answerMessage = createMessage(TYPE_ANSWER, payload);
        this.socket.send(JSON.stringify(answerMessage));
      },
    );
  };

  handleAnswer = async data => {
    const { payload } = data;
    await this.rtcPeerConnection.setRemoteDescription(payload.message);
  };

  handleIceCandidate = async data => {
    const { message } = data.payload;
    const candidate = JSON.parse(message);
    await this.rtcPeerConnection.addIceCandidate(candidate);
  };

  handleSocketConnection = socketID => {
    this.setState({ socketID });
  };

  handleConnectionReady = message => {
    console.log('Inside handleConnectionReady: ', message);
    if (message.startConnection) {
      this.setState({ connectionStarted: message.startConnection });
    }
  };

  addRemoteStream = remoteMediaStream => {
    this.setState({ remoteMediaStream });
  };

  handleStartConferencing = async () => {
    await this.openCamera();

    const { activityId } = this.props;
    const { socketID } = this.state;

    const roomKeyMessage = createMessage(
      TYPE_ROOM,
      createPayload(activityId, socketID),
    );
    this.socket.send(JSON.stringify(roomKeyMessage));
    this.setState({ roomKey: activityId });
  };

  render() {
    const {
      localMediaStream,
      remoteMediaStream,
      roomKey,
      socketID,
      iceServers,
      connectionStarted,
    } = this.state;
    const sendMessage = this.socket.send.bind(this.socket);

    return (
      <>
        <Websocket
          socket={this.socket}
          setSendMethod={this.setSendMethod}
          handleSocketConnection={this.handleSocketConnection}
          handleConnectionReady={this.handleConnectionReady}
          handleOffer={this.handleOffer}
          handleAnswer={this.handleAnswer}
          handleIceCandidate={this.handleIceCandidate}
        />
        <PeerConnection
          rtcPeerConnection={this.rtcPeerConnection}
          iceServers={iceServers}
          localMediaStream={localMediaStream}
          addRemoteStream={this.addRemoteStream}
          startConnection={connectionStarted}
          sendMessage={sendMessage}
          roomInfo={{ socketID, roomKey }}
        />
        <RTCVideo mediaStream={localMediaStream} />
        <RTCVideo mediaStream={remoteMediaStream} />
        <div style={{ height: 10, width: '100%' }} />
        <section style={{ display: 'flex', gap: 10 }}>
          <div
            onClick={this.handleStartConferencing}
            style={{
              width: 30,
              height: 30,
              background: 'green',
              borderRadius: '100%',
            }}
          ></div>
          <div
            style={{
              width: 30,
              height: 30,
              background: 'red',
              borderRadius: '100%',
            }}
            onClick={() => {
              localMediaStream.getTracks().forEach(track => track.stop());
              this.setState({ localMediaStream: null });
            }}
          ></div>
        </section>
      </>
    );
  }
}

export default RTCMesh;
