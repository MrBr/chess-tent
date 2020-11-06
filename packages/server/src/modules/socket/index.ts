import { SocketService, SocketStream } from "@types";
import application, { service } from "@application";
import socketIo, { Server, Socket } from "socket.io";
import {
  ACTION_EVENT,
  SUBSCRIBE_EVENT,
  UNSUBSCRIBE_EVENT
} from "@chess-tent/types";

let io: Server;

const middleware: SocketService["middleware"][] = [];
const getTokenFromCookie = (cookie: string | undefined) => {
  if (!cookie) {
    return;
  }
  const params = cookie.split(";");
  for (const index in params) {
    if (params[index].startsWith("token")) {
      // @ts-ignore
      return params[index].split("=")[1];
    }
  }
};

const identify: SocketService["identify"] = stream => {
  const token = getTokenFromCookie(stream.client.request.headers.cookie);
  return service.verifyToken(token);
};

const registerMiddleware = (socketMiddleware: SocketService["middleware"]) => {
  middleware.push(socketMiddleware);
};

const dispatch = (client: Socket, event: string, data: []) => {
  let index = 0;
  const next = (stream: SocketStream) => {
    index += 1;
    middleware[index]?.(stream, next);
  };
  middleware[index]?.({ client, data, event }, next);
};

const init: SocketService["init"] = server => {
  io = socketIo(server, { path: process.env.SOCKET_BASE_PATH });
  io.on("connection", function(client) {
    client.on(SUBSCRIBE_EVENT, function(channel) {
      dispatch(client, SUBSCRIBE_EVENT, channel);
    });

    client.on(UNSUBSCRIBE_EVENT, function(channel) {
      dispatch(client, UNSUBSCRIBE_EVENT, channel);
    });

    client.on(ACTION_EVENT, function(data) {
      dispatch(client, ACTION_EVENT, JSON.parse(data));
    });
  });
};

const sendAction = (channel: string, stream: SocketStream) => {
  // Using stream client to send action wont send it itself
  stream.client.in(channel).emit(ACTION_EVENT, stream.data);
};

application.socket.init = init;
application.socket.sendAction = sendAction;
application.socket.identify = identify;
application.socket.registerMiddleware = registerMiddleware;
