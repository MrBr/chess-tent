import { CONFERENCING_CONNECTION, CONFERENCING_ROOM } from '@chess-tent/types';
import type { Server, Socket } from 'socket.io';

const broadcast = (
  data: string,
  currentClient: Socket,
  clients: Record<string, Socket>,
) => {
  // TODO: replace with channel emit
  Object.keys(clients).forEach(clientID => {
    const client = clients[clientID];

    if (client !== currentClient && client.connected) {
      client.send(data);
    }
  });
};

export const initSignalServer = (socket: Server) => {
  // TODO: we don't need a dictionary, can be an array
  const channels: Record<string, Record<string, Socket>> = {};

  socket.on('connection', (currentClient: Socket) => {
    currentClient.on('message', (data: string) => {
      try {
        const parsedData = JSON.parse(data);

        switch (parsedData.type) {
          case CONFERENCING_ROOM:
            const { roomKey } = parsedData.payload;
            if (
              channels[roomKey] &&
              Object.keys(channels[roomKey]).length < 2
            ) {
              channels[roomKey][currentClient.id] = currentClient;

              const clients = channels[roomKey];
              const data = JSON.stringify({
                type: CONFERENCING_CONNECTION,
                startConnection: true,
              });

              broadcast(data, currentClient, clients);
            } else if (!channels[roomKey]) {
              channels[roomKey] = { [parsedData.payload]: currentClient };
            }
            break;
          default:
            const clientsInChannel = channels[parsedData.payload.roomKey];
            broadcast(data, currentClient, clientsInChannel);
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};
