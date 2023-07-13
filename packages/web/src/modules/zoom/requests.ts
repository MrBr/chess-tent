import { services } from '@application';
import {
  DataResponse,
  Endpoint,
  RequestFetch,
  RequestPost,
} from '@chess-tent/types';

interface ZoomAuthorizeData {
  refresh_token: string;
  access_token: string;
  token_type: string;
}

type ZoomAuthorizeRequest = RequestFetch<
  Endpoint<
    RequestPost<'/zoom/authorize', { code: string; redirectUri: string }>,
    DataResponse<ZoomAuthorizeData>
  >
>;

type ZoomSignatureRequest = RequestFetch<
  Endpoint<
    RequestPost<'/zoom/signature', { meetingNumber: string; role: number }>,
    DataResponse<string>
  >
>;

const zoomAuthorize = services.createRequest<ZoomAuthorizeRequest>(
  'POST',
  '/zoom/authorize',
);

const generateSignature = services.createRequest<ZoomSignatureRequest>(
  'POST',
  '/zoom/signature',
) as ZoomSignatureRequest;

export { zoomAuthorize, generateSignature };
