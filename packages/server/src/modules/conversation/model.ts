import { model, Schema, Document } from "mongoose";
import {
  Conversation,
  NormalizedConversation,
  TYPE_CONVERSATION,
  TYPE_USER
} from "@chess-tent/models";
import { db } from "@application";

const conversationSchema = db.createStandardSchema<NormalizedConversation>({
  type: ({
    type: String,
    default: TYPE_CONVERSATION
  } as unknown) as typeof TYPE_CONVERSATION,
  users: ([
    { type: String, ref: TYPE_USER }
  ] as unknown) as NormalizedConversation["users"],
  messages: ({
    type: Schema.Types.Mixed
  } as unknown) as NormalizedConversation["messages"]
});

const ConversationModel = model<NormalizedConversation & Document>(
  TYPE_CONVERSATION,
  conversationSchema
);

const depopulate = (conversation: Conversation): NormalizedConversation => ({
  ...conversation,
  users: conversation.users.map(user => user.id)
});

export { conversationSchema, ConversationModel, depopulate };
