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

export const getConversation =
  (withMessages = true): MiddlewareFunction =>
  (req, res, next) => {
    service
      .getConversation(
        res.locals.conversation.id as Conversation['id'],
        withMessages,
      )
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
    .findConversations(res.locals.filters.users, res.locals.pagination)
    .then(conversations => {
      res.locals.conversations = conversations;
      next();
    })
    .catch(next);
};

export const canEditConversations: MiddlewareFunction = (req, res, next) => {
  const canEdit = service.canEditConversations(
    res.locals.conversations || [res.locals.conversation],
    res.locals.me,
  );
  if (!canEdit) {
    throw new UnauthorizedConversationEditError();
  }
  next();
};

export const createInitialFounderConversation: MiddlewareFunction = async (
  req,
  res,
  next,
) => {
  const { founder, user, rawMessages } = res.locals;
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

  if (!Array.isArray(rawMessages)) {
    console.log('Missing raw messages');
    next();
    return;
  }

  const messages = rawMessages.map((message: string) =>
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
