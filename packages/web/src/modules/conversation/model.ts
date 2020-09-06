import { TYPE_CONVERSATION, TYPE_MESSAGE, TYPE_USER } from '@chess-tent/models';

export const conversationSchema = {
  type: TYPE_CONVERSATION,
  relationships: {
    // Messages have only author to normalize
    // but as the message author can be found in the users
    // there is no need to normalize messages
    // messages: TYPE_MESSAGE,
    users: TYPE_USER,
  },
};

export const messageSchema = {
  type: TYPE_MESSAGE,
  relationships: {
    owner: TYPE_USER,
  },
};
