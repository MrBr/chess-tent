import { useEffect } from 'react';
import { socket, hooks } from '@application';
import { Hooks } from '@types';
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

export { useSocketConnected, useSocketSubscribe, useSocketRoomUsers };
