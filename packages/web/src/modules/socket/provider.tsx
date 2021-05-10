import React, { ComponentType, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Actions,
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from '@chess-tent/types';
import { hooks } from '@application';

const { useDispatchBatched, useActiveUserRecord, useMeta } = hooks;
const socket = io(
  `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}`,
  {
    path: '/api/socket.io',
    secure: process.env.REACT_APP_PROTOCOL === 'https://',
    transports: ['websocket'], // Needed for build?
  },
);

export const sendAction = (action: Actions) =>
  socket.emit(ACTION_EVENT, JSON.stringify(action));
export const subscribe = (channel: string) =>
  socket.emit(SUBSCRIBE_EVENT, channel);
export const unsubscribe = (channel: string) =>
  socket.emit(UNSUBSCRIBE_EVENT, channel);
export const registerEvent = (event: string, onEvent: Function) => {
  socket.off(event);
  return socket.on(event, onEvent);
};
export const emitEvent = (event: string, data: any) => socket.emit(event, data);

export const SocketProvider: ComponentType = props => {
  const dispatch = useDispatchBatched();
  const [, updateSocketConnected] = useMeta('socketConnected');
  const [user] = useActiveUserRecord();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      updateSocketConnected(false);
      socket.disconnect();
    } else {
      updateSocketConnected(true);
      socket.connect();
    }
    return () => {
      updateSocketConnected(false);
      socket.disconnect();
    };
  }, [updateSocketConnected, userId]);

  useEffect(() => {
    socket.on(ACTION_EVENT, (action: Actions) => {
      action.meta.push = true;
      dispatch(action);
    });
  }, [dispatch]);
  return <>{props.children}</>;
};
