import { Schema } from 'mongoose';
import {
  Conversation,
  NormalizedConversation,
  TYPE_CONVERSATION,
  TYPE_MESSAGE,
  TYPE_USER,
} from '@chess-tent/models';
import { db } from '@application';

const transformVirtualMessages = (
  doc: unknown,
  ret: { virtualMessages?: []; messages: [] },
) => {
  if (!ret.virtualMessages) {
    return;
  }
  ret.messages = db.flattenBuckets(ret.virtualMessages, 'messages');
  delete ret.virtualMessages;
};

const conversationSchema = db
  .createSchema<NormalizedConversation>({
    type: {
      type: String,
      default: TYPE_CONVERSATION,
    } as unknown as typeof TYPE_CONVERSATION,
    users: [
      { type: String, ref: TYPE_USER },
    ] as unknown as NormalizedConversation['users'],
    lastMessageTimestamp: [
      { type: Schema.Types.Number },
    ] as unknown as NormalizedConversation['lastMessageTimestamp'],
    messages: {
      type: Schema.Types.Mixed,
    } as unknown as NormalizedConversation['messages'],
  })
  .set('toObject', {
    virtuals: true,
    transform: transformVirtualMessages,
  })
  .set('toJSON', {
    virtuals: true,
    transform: transformVirtualMessages,
  });

conversationSchema.virtual('virtualMessages', {
  ref: TYPE_MESSAGE,
  localField: '_id',
  foreignField: 'conversationId',
  options: { sort: { _id: -1 } },
});

const ConversationModel = db.createModel<NormalizedConversation>(
  TYPE_CONVERSATION,
  conversationSchema,
);

const depopulate = (conversation: Conversation): NormalizedConversation => ({
  ...conversation,
  users: conversation.users.map(user => user.id),
  messages: [],
});

export { conversationSchema, ConversationModel, depopulate };
