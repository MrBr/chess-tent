import { Actions } from '@chess-tent/types';

export type Socket = {
  middleware: (action: Actions) => void;
  sendAction: (action: Actions) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
};
