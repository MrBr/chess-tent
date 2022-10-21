import { useEffect } from 'react';
import { hooks, socket as socketNamespace } from '@application';
import { Hooks } from '@types';
import { ACTION_EVENT } from '@chess-tent/types';

import { socket } from '../service';

import { roomUsers } from '../record';

const { useMeta, useRecordInit } = hooks;

const useSocketConnected = () => {
  return useMeta('socketConnected', false);
};

const useSocketSubscribe: Hooks['useSocketSubscribe'] = channel => {
  const [connected] = useSocketConnected();
  useEffect(() => {
    if (!connected) {
      return;
    }
    socketNamespace.subscribe(channel);

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      connected && socketNamespace.unsubscribe(channel);
    };
  }, [channel, connected]);
};

const useSocketRoomUsers: Hooks['useSocketRoomUsers'] = room => {
  const record = useRecordInit(roomUsers, `room-${room}-users`);

  return record.value || [];
};

const useSocketActionListener: Hooks['useSocketActionListener'] = listener => {
  return useEffect(() => {
    socket.on(ACTION_EVENT, listener);
    return () => {
      socket.removeListener(ACTION_EVENT, listener);
    };
  }, [listener]);
};

export {
  useSocketActionListener,
  useSocketConnected,
  useSocketSubscribe,
  useSocketRoomUsers,
};
