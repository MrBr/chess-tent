import { service, middleware } from '@application';
import {
  authorizeUserByCode,
  generateSignature,
  getZakToken,
} from './middleware';

const { identify, toLocals, sendData } = middleware;

service.registerGetRoute(
  '/zoom/authorize',
  identify,
  getZakToken,
  sendData('zoomZakToken'),
);

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
