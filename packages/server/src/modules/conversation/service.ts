import { Conversation, NormalizedMessage, User } from "@chess-tent/models";
import { ConversationModel, depopulate } from "./model";
import { Pagination } from "@chess-tent/types";

export const saveConversation = (conversation: Conversation) =>
  new Promise(resolve => {
    ConversationModel.updateOne(
      { _id: conversation.id },
      depopulate(conversation),
      {
        upsert: true
      }
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const addMessageToConversation = (
  conversationId: Conversation["id"],
  message: NormalizedMessage
) =>
  new Promise(resolve => {
    ConversationModel.updateOne(
      { _id: conversationId },
      { $push: { messages: { $each: [message], $position: 0 } } }
    ).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const updateConversationMessage = (
  conversationId: Conversation["id"],
  messageId: NormalizedMessage["id"],
  messagePatch: Partial<NormalizedMessage>
) => {
  const patch = Object.keys(messagePatch).reduce<Record<string, any>>(
    (patch, key) => {
      patch["messages.$." + key] = messagePatch[key as keyof NormalizedMessage];
      return patch;
    },
    {}
  );
  new Promise(resolve => {
    ConversationModel.updateOne(
      { _id: conversationId, messages: { $elemMatch: { id: messageId } } },
      { $set: patch }
    ).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const findConversations = (
  users: User["id"][]
): Promise<Conversation[]> =>
  new Promise(resolve => {
    ConversationModel.find(
      { users: { $in: users } },
      { messages: { $slice: 1 } }
    )
      .populate("users")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });

export const getConversation = (
  conversationId: Conversation["id"]
): Promise<Conversation> =>
  new Promise(resolve => {
    ConversationModel.findById(conversationId, { messages: { $slice: 10 } })
      .populate("users")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result?.toObject());
      });
  });

export const getConversationMessages = (
  conversationId: Conversation["id"],
  pagination: Pagination
): Promise<Conversation> =>
  new Promise(resolve => {
    ConversationModel.findById(conversationId, {
      messages: { $slice: pagination }
    }).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve(result?.toObject().messages);
    });
  });
