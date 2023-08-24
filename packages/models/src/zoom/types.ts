import { User } from '../user';

export const TYPE_ZOOM_USER_TOKEN = 'zoom_user_tokens';

export enum ZoomRole {
  Guest = 0,
  Host = 1,
}

export enum ZoomConnectionStatus {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}

export interface ZoomUserToken {
  user: User;
  refreshToken: string;
  type: typeof TYPE_ZOOM_USER_TOKEN;
}

export interface NormalizedZoomUserToken {
  user: User['id'];
  refreshToken: ZoomUserToken['refreshToken'];
  type: ZoomUserToken['type'];
}
