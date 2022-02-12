import {
  CONFERENCING_ANSWER,
  CONFERENCING_CONNECTION,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';
import React, { Component } from 'react';

// TODO: refactor and move to hooks (like useSocketSubscribe)
class Websocket extends Component {
  setupConnection = () => {
    const {
      socket,
      handleConnectionReady,
      handleOffer,
      handleAnswer,
      handleICECandidate,
    } = this.props;

    socket.on('message', message => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case CONFERENCING_CONNECTION:
            handleConnectionReady(data);
            break;
          case CONFERENCING_OFFER:
            handleOffer(data);
            break;
          case CONFERENCING_ANSWER:
            handleAnswer(data);
            break;
          case CONFERENCING_ICECANDIDATE:
            handleICECandidate(data);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
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
