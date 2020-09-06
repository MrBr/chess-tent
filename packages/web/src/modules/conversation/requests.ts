import { services, requests } from '@application';
import { ConversationsResponse, Requests, StatusResponse } from '@types';
import { Conversation, User } from '@chess-tent/models';

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

requests.conversations = conversations;
requests.conversationSave = conversationSave;
requests.messageSend = messageSend;
