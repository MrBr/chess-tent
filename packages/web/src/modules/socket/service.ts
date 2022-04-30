import { constants } from '@application';
import io from 'socket.io-client';

const { APP_URL } = constants;

export const socket = io(APP_URL, {
  path: '/api/socket.io',
  secure: process.env.REACT_APP_PROTOCOL === 'https://',
  transports: ['websocket'], // Needed for build?,
  autoConnect: false, // Needed to prevent subscribing while user isn't authorised
});
