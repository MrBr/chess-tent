import React, { ComponentType, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Actions,
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from '@chess-tent/types';
import { hooks } from '@application';
import { useSocketConnected } from './hook';

const { useDispatchBatched, useActiveUserRecord } = hooks;
const socket = io(
  `${process.env.REACT_APP_PROTOCOL}${process.env.REACT_APP_DOMAIN}`,
  {
    path: '/api/socket.io',
    secure: process.env.REACT_APP_PROTOCOL === 'https://',
    transports: ['websocket'], // Needed for build?,
    autoConnect: false, // Needed to prevent subscribing while user isn't authorised
  },
);

export const sendAction = (action: Actions) =>
  socket.emit(ACTION_EVENT, JSON.stringify(action));
export const subscribe = (channel: string) =>
  socket.emit(SUBSCRIBE_EVENT, channel);
export const unsubscribe = (channel: string) =>
  socket.emit(UNSUBSCRIBE_EVENT, channel);

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
  });

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
    socket.on(ACTION_EVENT, (action: Actions) => {
      console.log('Socket Action Received', action);
      action.meta.push = true;
      dispatch(action);
    });
  }, [dispatch]);
  return <>{props.children}</>;
};
