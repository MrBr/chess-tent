import { MiddlewareFunction } from '@types';
import application from '@application';
import { Pagination } from '@chess-tent/types';
import {
  Conversation,
  createConversation,
  createMessage,
} from '@chess-tent/models';
import * as service from './service';
import { UnauthorizedConversationEditError } from './errors';

export const saveConversation: MiddlewareFunction = (req, res, next) => {
  service
    .saveConversation(res.locals.conversation as Conversation)
    .then(next)
    .catch(next);
};

export const addMessageToConversation: MiddlewareFunction = (
  req,
  res,
  next,
) => {
  service
    .addMessageToConversation(res.locals.conversation.id, res.locals.message)
    .then(next)
    .catch(next);
};

export const getConversation: MiddlewareFunction = (req, res, next) => {
  service
    .getConversation(res.locals.conversation.id as Conversation['id'])
    .then(conversation => {
      res.locals.conversation = conversation;
      next();
    })
    .catch(next);
};

export const getConversationMessages: MiddlewareFunction = (req, res, next) => {
  service
    .getConversationMessages(
      res.locals.conversation.id as Conversation['id'],
      res.locals.lastDocumentTimestamp as Pagination,
    )
    .then(messages => {
      res.locals.messages = messages;
      next();
    })
    .catch(next);
};

export const findConversations: MiddlewareFunction = (req, res, next) => {
  service
    .findConversations(res.locals.filters.users)
    .then(conversations => {
      res.locals.conversations = conversations;
      next();
    })
    .catch(next);
};

export const canEditConversation: MiddlewareFunction = (req, res, next) => {
  service
    .getConversation(res.locals.conversation.id)
    .then(conversation => {
      if (
        !conversation ||
        conversation.users.some(user => user.id === res.locals.me.id)
      ) {
        next();
        return;
      }
      throw new UnauthorizedConversationEditError();
    })
    .catch(next);
};

export const createInitialFounderConversation: MiddlewareFunction = async (
  req,
  res,
  next,
) => {
  const { founder, user } = res.locals;
  const participants = [user, founder];
  if (!founder) {
    console.log(
      `Founder not found! Founder id: ${
        process.env.FOUNDER_ID
          ? process.env.FOUNDER_ID
          : 'env FOUNDER_ID not defined.'
      }.
      Founder is used to send the first message and it's not necessary for development.`,
    );
    next();
    return;
  }

  const messages = [
    `Hi!`,
    `I am Luka. The founder of Chess Tent platform. For the time being I'll be you support :)`,
    `Chess Tent is truly aiming to be a community driven platform, every feedback is of great value. The platform is still in early phase so don't mind a bug or few. `,
    `Feel free to let me know if you have any questions.`,
    `Thank you for signing up! Have a good chess time.`,
  ].map(message =>
    createMessage(application.service.generateIndex(), founder, message),
  );

  const conversation = createConversation(
    application.service.generateIndex(),
    participants,
    messages,
  );
  await service.saveConversation(conversation);
  next();
};
