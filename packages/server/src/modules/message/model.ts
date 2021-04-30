import {
  Message,
  NormalizedMessage,
  TYPE_MESSAGE,
  TYPE_USER,
} from '@chess-tent/models';
import { db } from '@application';

const messageSchema = db.createSchema<NormalizedMessage>({
  type: ({
    type: String,
    default: TYPE_MESSAGE,
  } as unknown) as typeof TYPE_MESSAGE,
  conversationId: ({
    type: String,
  } as unknown) as NormalizedMessage['conversationId'],
  message: ({
    type: String,
  } as unknown) as NormalizedMessage['message'],
  owner: ({
    type: String,
    ref: TYPE_USER,
  } as unknown) as NormalizedMessage['owner'],
  timestamp: ({
    type: Number,
  } as unknown) as NormalizedMessage['timestamp'],
  read: ({
    type: Boolean,
  } as unknown) as NormalizedMessage['read'],
});

const MessageModel = db.createModel<NormalizedMessage>(
  TYPE_MESSAGE,
  messageSchema,
);

const depopulate = (message: Message): NormalizedMessage => message;

export { messageSchema, MessageModel, depopulate };
