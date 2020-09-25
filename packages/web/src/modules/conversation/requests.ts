import { services, requests } from '@application';
import {
  ConversationMessagesResponse,
  ConversationResponse,
  ConversationsResponse,
  Pagination,
  Requests,
  StatusResponse,
} from '@types';
import { Conversation, User } from '@chess-tent/models';

const conversation = services.createRequest<
  Conversation['id'],
  ConversationResponse
>('GET', conversationId => ({
  url: `/conversation/${conversationId}`,
}));

const conversations = services.createRequest<
  User['id'][] | User['id'],
  ConversationsResponse
>('POST', users => ({
  url: '/conversations',
  data: { users: Array.isArray(users) ? users : [users] },
}));

const messageSend: Requests['messageSend'] = services.createRequest(
  'PUT',
  (conversationId, message) => ({
    url: `/conversation/${conversationId}/message`,
    data: message,
  }),
);
const conversationSave = services.createRequest<Conversation, StatusResponse>(
  'POST',
  '/conversation/save',
);

const messages = services.createRequest<
  [Conversation['id'], Pagination],
  ConversationMessagesResponse
>('POST', (conversationId, pagination) => ({
  url: `/conversation/${conversationId}/messages`,
  data: pagination,
}));

requests.conversations = conversations;
requests.conversationSave = conversationSave;
requests.messageSend = messageSend;
requests.conversation = conversation;
requests.messages = messages;
