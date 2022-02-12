import type { Server, Socket } from 'socket.io';

const Constants = {
  TYPE_NEW_USER: 'NEW USER',
  TYPE_CHANNEL: 'ROOM',
  TYPE_CONNECTION: 'CONNECTION',
};

export class SignalServer {
  private _webSocket: Server;
  private _channels: Record<string, Record<string, Socket>>;
  private _users: number;

  constructor(socket: Server) {
    this._webSocket = socket;
    this._channels = {};
    this._users = 0;
  }

  connect() {
    this._webSocket.on('connection', (currentClient: Socket) => {
      currentClient.send(this._userConnected());

      currentClient.on('message', (data: string) => {
        try {
          const parsedData = JSON.parse(data);

          switch (parsedData.type) {
            case Constants.TYPE_CHANNEL:
              const { roomKey } = parsedData.payload;
              if (
                this._channels[roomKey] &&
                Object.keys(this._channels[roomKey]).length < 2
              ) {
                this._handleExistingChannel(parsedData.payload, currentClient);
              } else if (!this._channels[roomKey]) {
                this._createChannel(parsedData.payload, currentClient);
              }
              break;
            default:
              const clientsInChannel = this._channels[
                parsedData.payload.roomKey
              ];
              this._broadcast(data, currentClient, clientsInChannel);
          }
        } catch (error) {
          console.error(error);
        }
      });
    });
  }

  _broadcast(
    data: string,
    currentClient: Socket,
    clients: Record<string, Socket>,
  ) {
    // TODO: replace with channel emit
    Object.keys(clients).forEach(clientID => {
      const client = clients[clientID];

      if (client !== currentClient && client.connected) client.send(data);
    });
  }

  _userConnected() {
    const initialMessage = { type: Constants.TYPE_NEW_USER, id: this._users };
    this._users += 1;

    return JSON.stringify(initialMessage);
  }

  _handleExistingChannel(
    { roomKey, socketID }: { roomKey: string; socketID: string },
    currentClient: Socket,
  ) {
    this._channels[roomKey][socketID] = currentClient;

    const ready = { type: Constants.TYPE_CONNECTION, startConnection: true };
    const clients = this._channels[roomKey];
    const data = JSON.stringify(ready);

    this._broadcast(data, currentClient, clients);
  }

  _createChannel(
    { roomKey, socketID }: { roomKey: string; socketID: string },
    currentClient: Socket,
  ) {
    this._channels[roomKey] = { [socketID]: currentClient };
  }
}
