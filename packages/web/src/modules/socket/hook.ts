import { useEffect } from 'react';
import { socket, hooks } from '@application';
import { Hooks } from '@types';
import {
  ConferencingAction,
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

const isConferencingAction = (action: Actions): action is ConferencingAction =>
  [CONFERENCING_OFFER, CONFERENCING_ANSWER, CONFERENCING_ICECANDIDATE].some(
    actionType => actionType === action.type,
  );

const createUseConferencing: (socket: Socket) => Hooks['useConferencing'] =
  socket =>
  (fromUserId, toUserId, { handleAnswer, handleICECandidate, handleOffer }) => {
    return useEffect(() => {
      const listener = (data: Actions | string) => {
        if (typeof data === 'string' || !isConferencingAction(data)) return;

        if (
          (data.payload?.fromUserId === fromUserId ||
            data.payload?.fromUserId === toUserId) &&
          (data.payload?.toUserId === toUserId ||
            data.payload?.toUserId === fromUserId)
        ) {
          try {
            switch (data.type) {
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
        }
      };
      console.log('LISTENER ADDED');

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
