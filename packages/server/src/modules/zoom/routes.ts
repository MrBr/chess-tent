import { service, middleware } from '@application';
import { authorizeUserByCode, generateSignature } from './middleware';

const { identify, toLocals, sendData } = middleware;

service.registerPostRoute(
  '/zoom/authorize',
  identify,
  toLocals('zoom', req => req.body),
  authorizeUserByCode,
  sendData('zoomAuthorization'),
);

service.registerPostRoute(
  '/zoom/signature',
  identify,
  toLocals('zoom', req => req.body),
  generateSignature,
  sendData('zoomSignature'),
);
