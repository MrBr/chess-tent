import React, { Component } from 'react';

import {
  TYPE_CONNECTION,
  TYPE_OFFER,
  TYPE_ANSWER,
  TYPE_NEW_USER,
  TYPE_ICECANDIDATE,
} from './constants';

// TODO: refactor and move to hooks (like useSocketSubscribe)
class Websocket extends Component {
  setupConnection = () => {
    const {
      socket,
      handleConnectionReady,
      handleSocketConnection,
      handleOffer,
      handleAnswer,
      handleIceCandidate,
    } = this.props;

    socket.on('message', message => {
      try {
        const data = JSON.parse(message);

        if (!('type' in data)) return;

        switch (data.type) {
          case TYPE_NEW_USER:
            handleSocketConnection(data.id);
            break;
          case TYPE_CONNECTION:
            handleConnectionReady(data);
            break;
          case TYPE_OFFER:
            handleOffer(data);
            break;
          case TYPE_ANSWER:
            handleAnswer(data);
            break;
          case TYPE_ICECANDIDATE:
            handleIceCandidate(data);
            break;
          default:
            console.error('Receiving message failed');
        }
      } catch {}
    });
  };

  componentDidMount() {
    this.setupConnection();
  }

  render() {
    return <></>;
  }
}

export default Websocket;
