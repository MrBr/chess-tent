import { SocketService, SocketStream } from '@types';
import application, { service } from '@application';
import socketIo, { Server, Socket } from 'socket.io';
import {
  ACTION_EVENT,
  Actions,
  SocketEvents,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
} from '@chess-tent/types';
import { RecordAction } from '@chess-tent/redux-record/types';

let io: Server;

const middleware: SocketService['middleware'][] = [];
const getTokenFromCookie = (cookie: string | undefined) => {
  if (!cookie) {
    return;
  }
  const params = cookie.split(';');
  for (const index in params) {
    if (params[index].trim().startsWith('token')) {
      // @ts-ignore
      return params[index].split('=')[1];
    }
  }
};

const identify: SocketService['identify'] = stream => {
  const token = getTokenFromCookie(stream.client.request.headers.cookie);
  return service.verifyToken(token);
};

const registerMiddleware: SocketService['registerMiddleware'] = socketMiddleware => {
  middleware.push(socketMiddleware as SocketService['middleware']);
};

const dispatch = (client: Socket, event: SocketEvents, data: any) => {
  let index = 0;
  const next = (stream: SocketStream) => {
    index += 1;
    middleware[index]?.(stream, next);
  };
  middleware[index]?.({ client, data, event }, next);
};

const init: SocketService['init'] = server => {
  io = socketIo(server, { path: process.env.SOCKET_BASE_PATH });
  io.on('connection', function (client) {
    client.on(SUBSCRIBE_EVENT, function (channel) {
      dispatch(client, SUBSCRIBE_EVENT, channel);
    });

    client.on(UNSUBSCRIBE_EVENT, function (channel) {
      dispatch(client, UNSUBSCRIBE_EVENT, channel);
    });

    client.on(ACTION_EVENT, function (data) {
      dispatch(client, ACTION_EVENT, JSON.parse(data));
    });
  });
};

const sendAction = (channel: string, stream: SocketStream) => {
  // Using stream client wont send action to itself
  stream.client.in(channel).emit(ACTION_EVENT, stream.data);
};

const sendServerAction = (
  channel: string,
  action: Actions | RecordAction,
  toSocketId?: string,
) => {
  if (toSocketId) {
    io.to(toSocketId).emit(ACTION_EVENT, action);
    return;
  }
  // Sending action to all the clients
  // Be careful not to send action to the action owner
  io.in(channel).emit(ACTION_EVENT, action);
};

const shouldSyncData = (roomId: string) => {
  const roomSockets = Object.keys(io.sockets.adapter.rooms[roomId].sockets);
  return roomSockets.length > 1;
};

const getOwnerSocketId = (roomId: string) => {
  const roomSockets = Object.keys(io.sockets.adapter.rooms[roomId].sockets);
  return roomSockets && roomSockets[0];
};

application.socket.init = init;
application.socket.sendAction = sendAction;
application.socket.sendServerAction = sendServerAction;
application.socket.shouldSyncData = shouldSyncData;
application.socket.getOwnerSocketId = getOwnerSocketId;
application.socket.identify = identify;
application.socket.registerMiddleware = registerMiddleware;
