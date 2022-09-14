import { db, service } from '@application';
import {
  Conversation,
  Message,
  NormalizedMessage,
  User,
  updateMessage,
} from '@chess-tent/models';
import { Pagination } from '@chess-tent/types';
import { MessageModel, ConversationModel, depopulate } from './model';
import { MESSAGES_BUCKET_LIMIT, MESSAGE_EMAIL_TIME_DIFF_MS } from './constant';

const { sendMail } = service;
export const addMessageToConversation = async (
  conversationId: Conversation['id'],
  message: NormalizedMessage,
) => {
  const idRegex = db.getBucketingIdFilterRegex(conversationId);
  // Server should be the source of truth for time
  const updatedMessage = updateMessage(message, {
    timestamp: Date.now(),
  });

  await ConversationModel.updateOne(
    { _id: conversationId },
    { lastMessageTimestamp: updatedMessage.timestamp },
  );

  await MessageModel.updateOne(
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
  ).exec();
};

export const saveConversation = async (conversation: Conversation) => {
  await ConversationModel.updateOne(
    { _id: conversation.id },
    depopulate(conversation),
    {
      upsert: true,
    },
  ).exec(err => {
    if (err) {
      throw err;
    }
  });
  // TODO - add a service for adding multiple messages
  if (conversation.messages.length > 0) {
    for await (const message of conversation.messages) {
      await addMessageToConversation(conversation.id, message);
    }
  }
};

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
  new Promise<void>(resolve => {
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

export const findConversations = async (
  users: User['id'][],
  pagination: Pagination,
) => {
  return await ConversationModel.find({ users: { $in: users } }, null, {
    skip: pagination.skip,
    limit: pagination.limit,
  })
    .sort([
      ['lastMessageTimestamp', -1],
      ['_id', 1],
    ])
    .populate('users')
    .populate({
      path: 'virtualMessages',
      options: {
        limit: 1,
      },
    });
};

export const getConversation = async (
  conversationId: Conversation['id'],
  withMessages = true,
): Promise<Conversation | undefined> => {
  const find = ConversationModel.findById(conversationId).populate('users');

  withMessages &&
    find.populate({
      path: 'virtualMessages',
      options: {
        limit: 1,
      },
    });

  const conversation = await find.exec();
  return conversation?.toObject<Conversation>() || undefined;
};

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

export const canEditConversations = (
  conversations: Conversation[],
  user: User,
) => {
  return conversations.every(conversation =>
    conversation.users.some(({ id }) => id === user.id),
  );
};

export const shouldEmailMessage = (conversation: Conversation) =>
  !conversation.lastMessageTimestamp ||
  Date.now() - conversation.lastMessageTimestamp > MESSAGE_EMAIL_TIME_DIFF_MS;

export const sendMessageNotificationViaEmail = (
  owner: User,
  user: User,
  message: string,
) => {
  sendMail({
    from: 'Chess Tent <noreply@chesstent.com>',
    to: user.email,
    subject: 'Chess Tent - New message',
    html: `<p>Hey ${user.name},</p>
      <p>You've received a new message from ${owner.name}.</p>
      <p><i>${message}</i></p>
      <p>You can see the full conversation at <a href="${
        process.env.APP_DOMAIN
      }">${process.env.APP_DOMAIN?.replace('https://', '')}</a></p>`,
  });
};
