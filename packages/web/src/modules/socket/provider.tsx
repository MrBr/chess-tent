import React, { ComponentType, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Actions,
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from '@chess-tent/types';
import { hooks, constants } from '@application';
import { createUseConferencing, useSocketConnected } from './hook';

const { useDispatchBatched, useActiveUserRecord } = hooks;
const { APP_URL } = constants;

const socket = io(APP_URL, {
  path: '/api/socket.io',
  secure: process.env.REACT_APP_PROTOCOL === 'https://',
  transports: ['websocket'], // Needed for build?,
  autoConnect: false, // Needed to prevent subscribing while user isn't authorised
});

export const sendAction = (action: Actions) =>
  socket.emit(ACTION_EVENT, JSON.stringify(action));
export const subscribe = (channel: string) =>
  socket.emit(SUBSCRIBE_EVENT, channel);
export const unsubscribe = (channel: string) =>
  socket.emit(UNSUBSCRIBE_EVENT, channel);

export const useConferencing = createUseConferencing(socket);

export const SocketProvider: ComponentType = props => {
  const dispatch = useDispatchBatched();
  const [, updateSocketConnected] = useSocketConnected();
  const { value: user } = useActiveUserRecord(null);
  const userId = user?.id;

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected');
      updateSocketConnected(socket.connected);
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      updateSocketConnected(socket.connected);
    });
    return () => {
      socket.removeAllListeners();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!userId) {
      socket.disconnect();
    } else {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [updateSocketConnected, userId]);

  useEffect(() => {
    socket.on(ACTION_EVENT, (action: Actions | string) => {
      if (typeof action === 'string') return;

      console.log('Socket Action Received', action);
      action.meta.push = true;
      dispatch(action);
    });
  }, [dispatch]);
  return <>{props.children}</>;
};
