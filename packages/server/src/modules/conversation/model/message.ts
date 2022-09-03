import { Schema } from 'mongoose';
import { db } from '@application';
import { NormalizedMessageBucket, TYPE_MESSAGE } from '@chess-tent/models';

const messageSchema = db.createSchema<NormalizedMessageBucket>({
  type: {
    type: String,
    default: TYPE_MESSAGE,
  } as unknown as typeof TYPE_MESSAGE,
  conversationId: {
    type: String,
  } as unknown as NormalizedMessageBucket['conversationId'],
  count: {
    type: Number,
  } as unknown as NormalizedMessageBucket['count'],
  messages: {
    type: Schema.Types.Mixed,
  } as unknown as NormalizedMessageBucket['messages'],
});

const MessageModel = db.createModel<NormalizedMessageBucket>(
  TYPE_MESSAGE,
  messageSchema,
);

export { messageSchema, MessageModel };
