import { Actions } from '@chess-tent/types';

export type Socket = {
  middleware: (action: Actions) => void;
  sendAction: (action: Actions) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  registerEvent: (event: string, onEvent: Function) => SocketIOClient.Emitter;
  emitEvent: (event: string, data: any) => SocketIOClient.Socket;
};
