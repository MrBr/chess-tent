import { Conversation, NormalizedMessage, User } from "@chess-tent/models";
import { ConversationModel, depopulate } from "./model";

export const saveConversation = (conversation: Conversation) =>
  new Promise(resolve => {
    ConversationModel.updateOne(
      { _id: conversation.id },
      depopulate(conversation),
      {
        upsert: true
      }
    ).exec((err, result) => {
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
      { $push: { messages: message } }
    ).exec((err, result) => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const findConversations = (
  users: User["id"][] | User["id"]
): Promise<Conversation[]> =>
  new Promise(resolve => {
    ConversationModel.find({ users })
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
    ConversationModel.findById(conversationId)
      .populate("users")
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result?.toObject());
      });
  });
