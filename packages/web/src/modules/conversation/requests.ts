import { services, requests } from '@application';
import { Requests } from '@types';

const conversation = services.createRequest<Requests['conversation']>(
  'GET',
  conversationId => `/conversation/${conversationId}`,
);

const conversations = services.createRequest<Requests['conversations']>(
  'POST',
  '/conversations',
  users => ({ users: Array.isArray(users) ? users : [users] }),
);

const messageSend: Requests['messageSend'] = services.createRequest<
  Requests['messageSend']
>(
  'PUT',
  conversationId => `/conversation/${conversationId}/message`,
  (conversationId, message) => message,
);

const conversationSave = services.createRequest<Requests['conversationSave']>(
  'POST',
  '/conversation/save',
);

const messages = services.createRequest<Requests['messages']>(
  'POST',
  conversationId => `/conversation/${conversationId}/messages`,
  (conversationId, lastDocumentTimestamp) => ({ lastDocumentTimestamp }),
);

requests.conversations = conversations;
requests.conversationSave = conversationSave;
requests.messageSend = messageSend;
requests.conversation = conversation;
requests.messages = messages;
