import {
  Conversation,
  Message,
  NormalizedMessage,
  User,
} from '@chess-tent/models';
import { Pagination } from '@chess-tent/types';
import { MessageModel } from 'modules/message/model';
import { ConversationModel, depopulate } from './model';

const MESSAGES_BUCKET_LIMIT = 20;

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
    const idRegex = new RegExp(String.raw`^${conversationId}_`);
    MessageModel.updateOne(
      {
        _id: idRegex,
        count: { $lt: MESSAGES_BUCKET_LIMIT },
      },
      {
        $push: {
          messages: {
            $each: [message],
            $position: 0,
          },
        },
        $inc: { count: 1 },
        $set: { conversationId },
        $setOnInsert: {
          _id: `${conversationId}_${message.timestamp}`,
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
          sort: { _id: -1 },
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
          sort: { _id: -1 },
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
    const idRegex = new RegExp(String.raw`^${conversationId}_`);

    const filterBy = lastDocumentTimestamp
      ? { $lt: `${conversationId}_${lastDocumentTimestamp}` }
      : { _id: idRegex };

    MessageModel.find({
      _id: filterBy,
    })
      .sort({ _id: -1 })
      .limit(1)
      .exec((err, result) => {
        if (err) {
          throw err;
        }
        const messageBuckets = result.map(item => item.toObject());
        const messages = messageBuckets.reduce(
          (messagesAll: any, messagesBucket: any) => {
            return messagesAll.concat(messagesBucket.messages);
          },
          [],
        );

        resolve(messages);
      });
  });
