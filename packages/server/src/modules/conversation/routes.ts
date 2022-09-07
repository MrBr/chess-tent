import application, { middleware } from '@application';
import {
  canEditConversations,
  getConversation,
  saveConversation,
  findConversations,
  addMessageToConversation,
  getConversationMessages,
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

application.service.registerPutRoute(
  '/conversation/:conversationId/message',
  identify,
  toLocals('message', req => req.body),
  toLocals('conversation.id', req => req.params.conversationId),
  canEditConversations,
  addMessageToConversation,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/conversations',
  identify,
  toLocals('filters', req => ({ users: req.body.users })),
  toLocals('pagination', req => req.body.pagination),
  findConversations,
  canEditConversations,
  sendData('conversations'),
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
