import {
  Conversation,
  Message,
  NormalizedMessage,
  User,
} from '@chess-tent/models';
import { Pagination } from '@chess-tent/types';
import { MessageModel } from 'modules/message/model';
import { ConversationModel, depopulate } from './model';

export const saveConversation = (conversation: Conversation) =>
  new Promise(resolve => {
    console.log('saveConversation', conversation);
    ConversationModel.updateOne(
      { _id: conversation.id },
      depopulate(conversation),
      {
        upsert: true,
      },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const addMessageToConversation = (
  conversationId: Conversation['id'],
  message: NormalizedMessage,
) =>
  new Promise(resolve => {
    MessageModel.updateOne(
      { _id: message.id, conversationId: conversationId },
      message,
      {
        upsert: true,
      },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });

export const updateConversationMessage = (
  conversationId: Conversation['id'],
  messageId: NormalizedMessage['id'],
  messagePatch: Partial<NormalizedMessage>,
) => {
  const patch = Object.keys(messagePatch).reduce<Record<string, any>>(
    (patch, key) => {
      patch[key] = messagePatch[key as keyof NormalizedMessage];
      return patch;
    },
    {},
  );
  new Promise(resolve => {
    MessageModel.updateOne(
      { _id: messageId, conversationId: conversationId },
      { $set: patch },
      { upsert: true },
    ).exec(err => {
      if (err) {
        throw err;
      }
      resolve();
    });
  });
};

export const findConversations = (
  users: User['id'][],
): Promise<Conversation[]> =>
  new Promise(resolve => {
    ConversationModel.find({ users: { $in: users } })
      .populate('users')
      .populate({
        path: 'virtualMessages',
        options: {
          limit: 1,
        },
      })
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        console.log('findConversations', result);
        resolve(result.map(item => item.toObject()));
      });
  });

export const getConversation = (
  conversationId: Conversation['id'],
): Promise<Conversation> =>
  new Promise(resolve => {
    ConversationModel.findById(conversationId)
      .populate('users')
      .populate({
        path: 'virtualMessages',
        options: {
          limit: 10,
        },
      })
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        console.log('getConversation', result);
        resolve(result?.toObject());
      });
  });

export const getConversationMessages = (
  conversationId: Conversation['id'],
  pagination: Pagination,
): Promise<Message[]> =>
  new Promise(resolve => {
    const numToSkip = pagination[0];
    const numToReturn = pagination[1];
    MessageModel.find({
      conversationId: conversationId,
    })
      .skip(numToSkip)
      .limit(numToReturn)
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result.map(item => item.toObject()));
      });
  });
