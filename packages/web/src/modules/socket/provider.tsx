import React, { ComponentType, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Actions,
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from '@chess-tent/types';
import { hooks } from '@application';

const { useDispatchBatched } = hooks;
const socket = io(`ws://${process.env.REACT_APP_DOMAIN}`, {
  path: '/api/socket.io',
});

export const sendAction = (action: Actions) =>
  socket.emit(ACTION_EVENT, JSON.stringify(action));
export const subscribe = (channel: string) =>
  socket.emit(SUBSCRIBE_EVENT, channel);
export const unsubscribe = (channel: string) =>
  socket.emit(UNSUBSCRIBE_EVENT, channel);

export const SocketProvider: ComponentType = props => {
  const dispatch = useDispatchBatched();
  useEffect(() => {
    socket.on(ACTION_EVENT, (action: Actions) => {
      action.meta.push = true;
      dispatch(action);
    });
  });
  return <>{props.children}</>;
};
