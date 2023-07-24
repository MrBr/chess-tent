import { services } from '@application';
import { Requests } from '@types';

const zoomAuthorize = services.createRequest<Requests['zoomAuthorize']>(
  'POST',
  '/zoom/authorize',
);

const generateSignature = services.createRequest<Requests['zoomSignature']>(
  'POST',
  '/zoom/signature',
);

export { zoomAuthorize, generateSignature };
