import application, { middleware } from '@application';
import { generateImageSignedUrl } from './middleware';

const { sendData, identify, toLocals } = middleware;

application.service.registerPostRoute(
  '/sign-image-url',
  identify,
  // TODO - permissions? imagePosition use to validate signing
  toLocals('key', req => req.body.key),
  toLocals('contentType', req => req.body.contentType),
  generateImageSignedUrl,
  sendData('url'),
);
