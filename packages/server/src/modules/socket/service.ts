import { ClientSocketStream, SocketService, SocketStream } from '@types';
import application, { service, socket } from '@application';
import { Server } from 'socket.io';
import {
  ACTION_EVENT,
  Actions,
  CONNECTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT,
  UNSUBSCRIBED_EVENT,
} from '@chess-tent/types';
import { RecordAction } from '@chess-tent/redux-record/types';
import { UPDATE_RECORD } from '@chess-tent/redux-record';

let io: Server;

const middleware: SocketService['middleware'][] = [];

const isClientSocketStream = (stream: unknown): stream is ClientSocketStream =>
  typeof stream === 'object' && !!stream?.hasOwnProperty('client');

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
  if (!isClientSocketStream(stream)) {
    return null;
  }
  const token = getTokenFromCookie(stream.client.request.headers.cookie);
  return service.verifyToken(token);
};

const registerMiddleware: SocketService['registerMiddleware'] =
  socketMiddleware => {
    middleware.push(socketMiddleware as SocketService['middleware']);
  };

const dispatch = (stream: SocketStream) => {
  let index = 0;
  const next = (stream: SocketStream) => {
    index += 1;
    middleware[index]?.(stream, next);
  };
  middleware[index]?.(stream, next);
};

const init: SocketService['init'] = server => {
  io = new Server(server, { path: process.env.SOCKET_BASE_PATH });

  io.on(CONNECTION_EVENT, function (client) {
    dispatch({ client, event: CONNECTION_EVENT });

    client.on(SUBSCRIBE_EVENT, function (room) {
      dispatch({ client, data: room, event: SUBSCRIBE_EVENT });
    });

    client.on(UNSUBSCRIBE_EVENT, function (room) {
      dispatch({ client, data: room, event: UNSUBSCRIBE_EVENT });
    });

    client.on(ACTION_EVENT, function (data) {
      dispatch({ client, data: JSON.parse(data), event: ACTION_EVENT });
    });
  });
  io.of('/').adapter.on('leave-room', (room, clientId) => {
    dispatch({ clientId, data: room, event: UNSUBSCRIBED_EVENT });
  });
};

const getRoomUsers: SocketService['getRoomUsers'] = room => {
  const clients = io.of('/').adapter.rooms.get(room);
  if (!clients) {
    return [];
  }
  return Array.from(clients.values())
    .map(clientId => io.sockets.sockets.get(clientId)?.data.userId)
    .filter(Boolean);
};

const sendAction = (channel: string, stream: ClientSocketStream) => {
  // Using stream client wont send action to itself
  stream.client.in(channel).emit(ACTION_EVENT, stream.data);
};

export const sendServerAction = (
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
  const size = io.of('/').adapter.rooms.get(roomId)?.size || 0;
  return size >= 1;
};

const dispatchRoomUsers: SocketService['dispatchRoomUsers'] = room => {
  const users = socket.getRoomUsers(room);
  socket.sendServerAction(room, {
    type: UPDATE_RECORD,
    payload: {
      value: users,
    },
    meta: { key: `room-${room}-users` },
  });
};

const getOwnerSocketId = (roomId: string) => {
  const sockets = io.sockets.adapter.rooms.get(roomId)?.values();
  return sockets && sockets.next().value;
};

application.socket.init = init;
application.socket.sendAction = sendAction;
application.socket.sendServerAction = sendServerAction;
application.socket.shouldSyncData = shouldSyncData;
application.socket.getOwnerSocketId = getOwnerSocketId;
application.socket.identify = identify;
application.socket.getRoomUsers = getRoomUsers;
application.socket.dispatchRoomUsers = dispatchRoomUsers;
application.socket.registerMiddleware = registerMiddleware;
