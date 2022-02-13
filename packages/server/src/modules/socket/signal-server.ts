import {
  ACTION_EVENT,
  CONFERENCING_CONNECTION,
  CONFERENCING_ROOM,
} from '@chess-tent/types';
import type { Server, Socket } from 'socket.io';

import type { Actions } from '@chess-tent/types';

// TODO: replace with channel emit
const broadcast = (data: Actions, currentClient: Socket, clients: Socket[]) => {
  clients.forEach(client => {
    if (client !== currentClient && client.connected) {
      client.emit(ACTION_EVENT, JSON.stringify(data));
    }
  });
};

// TODO: move to activity middleware
export const initSignalServer = (socket: Server) => {
  const channels: Record<string, Socket[]> = {};

  socket.on('connection', (currentClient: Socket) => {
    currentClient.on(ACTION_EVENT, (message: string) => {
      try {
        const data: Actions = JSON.parse(message);

        switch (data.type) {
          case CONFERENCING_ROOM:
            const { activityId } = data.payload;

            if (channels[activityId] && channels[activityId].length < 2) {
              channels[activityId].push(currentClient);

              const clients = channels[activityId];

              broadcast(
                {
                  type: CONFERENCING_CONNECTION,
                  payload: {
                    startConnection: true,
                  },
                  meta: {},
                },
                currentClient,
                clients,
              );
            } else if (!channels[activityId]) {
              channels[activityId] = [currentClient];
            }
            break;
          default:
            if (data.payload && 'activityId' in data.payload) {
              const clientsInChannel = channels[data.payload.activityId];
              broadcast(data, currentClient, clientsInChannel);
            }
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};
