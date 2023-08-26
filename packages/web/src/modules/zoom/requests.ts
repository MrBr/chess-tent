import { services, requests } from '@application';
import { Requests } from '@types';

const zoomZakToken = services.createRequest<Requests['zoomZakToken']>(
  'GET',
  '/zoom/authorize',
);

const zoomAuthorize = services.createRequest<Requests['zoomAuthorize']>(
  'POST',
  '/zoom/authorize',
);

const generateSignature = services.createRequest<Requests['zoomSignature']>(
  'POST',
  '/zoom/signature',
);

requests.zoomZakToken = zoomZakToken;
requests.zoomAuthorize = zoomAuthorize;
requests.zoomSignature = generateSignature;
