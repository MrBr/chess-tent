import { MiddlewareFunction } from "@types";
import { Conversation } from "@chess-tent/models";
import * as service from "./service";
import { UnauthorizedConversationEditError } from "./errors";
import { Pagination } from "@chess-tent/types";

export const saveConversation: MiddlewareFunction = (req, res, next) => {
  service
    .saveConversation(res.locals.conversation as Conversation)
    .then(next)
    .catch(next);
};

export const addMessageToConversation: MiddlewareFunction = (
  req,
  res,
  next
) => {
  service
    .addMessageToConversation(res.locals.conversation.id, res.locals.message)
    .then(next)
    .catch(next);
};

export const getConversation: MiddlewareFunction = (req, res, next) => {
  service
    .getConversation(res.locals.conversation.id as Conversation["id"])
    .then(conversation => {
      res.locals.conversation = conversation;
      next();
    })
    .catch(next);
};

export const getConversationMessages: MiddlewareFunction = (req, res, next) => {
  service
    .getConversationMessages(
      res.locals.conversation.id as Conversation["id"],
      res.locals.pagination as Pagination
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
