import { useEffect } from 'react';
import { socket, hooks } from '@application';
import { Hooks, ROOM_USERS_ACTION } from '@types';
import {
  ACTION_EVENT,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';

import { Socket } from 'socket.io-client';

import type { Actions } from '@chess-tent/types';

import { roomUsers } from './record';

const { useMeta, useRecordInit } = hooks;

const useSocketConnected = () => {
  return useMeta('socketConnected');
};

const useSocketSubscribe: Hooks['useSocketSubscribe'] = channel => {
  const [connected] = useSocketConnected();
  useEffect(() => {
    if (channel) {
      connected ? socket.subscribe(channel) : socket.unsubscribe(channel);
    }

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      channel && socket.unsubscribe(channel);
    };
  }, [channel, connected]);
};

const useSocketRoomUsers: Hooks['useSocketRoomUsers'] = room => {
  const record = useRecordInit(roomUsers, `room-${room}-users`);

  return record.value || [];
};

const createUseConferencing: (socket: Socket) => Hooks['useConferencing'] =
  socket =>
  ({
    handleAnswer,
    handleConnectionReady,
    handleICECandidate,
    handleOffer,
  }) => {
    return useEffect(() => {
      const listener = (data: Actions | string) => {
        if (typeof data === 'string') return;

        try {
          switch (data.type) {
            case ROOM_USERS_ACTION:
              if (data.payload.length > 1) {
                handleConnectionReady();
              }
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
      };

      socket.on(ACTION_EVENT, listener);
      return () => {
        socket.removeListener();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };

export {
  createUseConferencing,
  useSocketConnected,
  useSocketSubscribe,
  useSocketRoomUsers,
};
