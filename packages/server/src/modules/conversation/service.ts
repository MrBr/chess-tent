import { db } from '@application';
import {
  Conversation,
  Message,
  NormalizedMessage,
  User,
  updateMessage,
} from '@chess-tent/models';
import { Pagination } from '@chess-tent/types';
import { MessageModel } from 'modules/message/model';
import { ConversationModel, depopulate } from './model';

const MESSAGES_BUCKET_LIMIT = 50;

export const saveConversation = (conversation: Conversation) =>
  new Promise(resolve => {
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
    const idRegex = db.getBucketingIdFilterRegex(conversationId);
    // Server should be the source of truth for time
    const updatedMessage = updateMessage(message, {
      timestamp: Date.now(),
    });
    MessageModel.updateOne(
      {
        _id: idRegex,
        count: { $lt: MESSAGES_BUCKET_LIMIT },
      },
      {
        $push: { messages: updatedMessage },
        $inc: { count: 1 },
        $set: { conversationId },
        $setOnInsert: {
          _id: `${conversationId}_${updatedMessage.timestamp}`,
        },
      },
      { upsert: true },
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
  messageTimestamp: NormalizedMessage['timestamp'],
  messagePatch: Partial<NormalizedMessage>,
) => {
  const patch = Object.keys(messagePatch).reduce<Record<string, any>>(
    (patch, key) => {
      patch['messages.$.' + key] = messagePatch[key as keyof NormalizedMessage];
      return patch;
    },
    {},
  );
  new Promise(resolve => {
    MessageModel.updateOne(
      {
        _id: {
          $lte: `${conversationId}_${messageTimestamp}`,
        },
        'messages.timestamp': messageTimestamp,
      },
      { $set: patch },
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
          limit: 1,
        },
      })
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(result?.toObject());
      });
  });

export const getConversationMessages = (
  conversationId: Conversation['id'],
  lastDocumentTimestamp: Pagination,
): Promise<Message[]> =>
  new Promise(resolve => {
    const idRegex = db.getBucketingIdFilterRegex(conversationId);

    const filterBy = lastDocumentTimestamp
      ? { $lt: `${conversationId}_${lastDocumentTimestamp}` }
      : idRegex;

    MessageModel.find({
      _id: filterBy,
      conversationId,
    })
      .sort({ _id: -1 })
      .limit(1)
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        resolve(db.flattenBuckets(result, 'messages'));
      });
  });
