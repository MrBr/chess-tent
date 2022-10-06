import application, { middleware } from '@application';
import {
  canEditConversations,
  getConversation,
  saveConversation,
  getConversations,
  getConversationMessages,
  getConversationsContacts,
} from './middleware';

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  '/conversation/save',
  identify,
  toLocals('conversation', req => req.body),
  canEditConversations,
  saveConversation,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/conversations',
  identify,
  toLocals('filters', req => ({ users: req.body.users })),
  toLocals('pagination', req => req.body.pagination),
  getConversations,
  canEditConversations,
  sendData('conversations'),
);

application.service.registerGetRoute(
  '/contacts',
  identify,
  toLocals('pagination', req => ({
    skip: parseInt(req.query.skip as string),
    limit: parseInt(req.query.limit as string),
  })),
  getConversationsContacts,
  sendData('contacts'),
);

application.service.registerGetRoute(
  '/conversation/:conversationId',
  identify,
  toLocals('conversation.id', req => req.params.conversationId),
  getConversation(),
  canEditConversations,
  sendData('conversation'),
);

application.service.registerPostRoute(
  '/conversation/:conversationId/messages',
  identify,
  toLocals('conversation.id', req => req.params.conversationId),
  toLocals('lastDocumentTimestamp', req => req.body.lastDocumentTimestamp),
  getConversation(false),
  canEditConversations,
  getConversationMessages,
  sendData('messages'),
);
