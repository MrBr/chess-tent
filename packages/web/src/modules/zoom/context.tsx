import { createContext, useContext, RefObject } from 'react';

import { ZoomRole, User, ZoomConnectionStatus } from '@chess-tent/models';

export interface InitialContextData {
  meetingNumber: string | undefined;
  user: User;
  code: string | undefined;
  redirectUri: string;
  zoomSDKElementRef: RefObject<HTMLElement>;
}

export const ZoomContext = createContext({} as any);

export const useZoomContext = () => useContext(ZoomContext);

export const createInitialContext = ({
  meetingNumber,
  user,
  code,
  redirectUri,
  zoomSDKElementRef,
}: InitialContextData) => ({
  userSignature: null,
  hostUserZakToken: undefined,
  meetingNumber: meetingNumber?.replaceAll(' ', ''),
  username: user.nickname,
  password: null,
  role: user?.coach ? ZoomRole.Host : ZoomRole.Guest,
  authCode: code,
  redirectUri,
  updateContext: () => {},
  resetContext: () => {},
  connectionStatus: ZoomConnectionStatus.NOT_CONNECTED,
  zoomSDKElementRef,
});
