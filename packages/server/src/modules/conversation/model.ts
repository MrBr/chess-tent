import { Schema } from 'mongoose';
import {
  Conversation,
  NormalizedConversation,
  TYPE_CONVERSATION,
  TYPE_MESSAGE,
  TYPE_USER,
} from '@chess-tent/models';
import { db } from '@application';

const conversationSchema = db
  .createSchema<NormalizedConversation>({
    type: ({
      type: String,
      default: TYPE_CONVERSATION,
    } as unknown) as typeof TYPE_CONVERSATION,
    users: ([
      { type: String, ref: TYPE_USER },
    ] as unknown) as NormalizedConversation['users'],
    messages: ({
      type: Schema.Types.Mixed,
    } as unknown) as NormalizedConversation['messages'],
  })
  .set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      ret.messages = ret.virtualMessages.reduce(
        (messagesAll: any, messagesBucket: any) => {
          return messagesAll.concat(messagesBucket.messages);
        },
        [],
      );
      delete ret.virtualMessages;
    },
  });

conversationSchema.virtual('virtualMessages', {
  ref: TYPE_MESSAGE,
  localField: '_id',
  foreignField: 'conversationId',
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
