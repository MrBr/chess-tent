import io from 'socket.io-client';

if (!process.env.REACT_APP_SOCKET_URL) {
  throw new Error('Undefined socket url');
}

const socketUrl = process.env.REACT_APP_SOCKET_URL as string;
const protocol = socketUrl.match(/http[s]?/)?.[0] as string;
const [, domain, path] = socketUrl.split(/http[s]?:\/\/(.[a-z\.\:0-9]*)/);

export const socket = io(domain, {
  path,
  secure: /https:/.test(protocol),
  transports: ['websocket'], // Needed for build?,
  autoConnect: false, // Needed to prevent subscribing while user isn't authorised
});
