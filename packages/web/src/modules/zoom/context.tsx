import { createContext, useContext, RefObject } from 'react';

import { ZoomRole, User } from '@chess-tent/models';

export interface InitialContextData {
  meetingNumber: string | undefined;
  user: User;
  code: string | undefined;
  redirectUri: string;
  zoomSDKElementRef: RefObject<HTMLElement>;
}

export enum ZoomConnectionStatus {
  NOT_CONNECTED,
  CONNECTING,
  CONNECTED,
}

export interface ZoomContextType {
  userSignature: string | null;
  hostUserZakToken: string | undefined;
  meetingNumber: string | undefined;
  username: string;
  password: string | null;
  role: ZoomRole;
  authCode: string | undefined;
  redirectUri: string | '';
  updateContext: Function;
  resetContext: Function;
  connectionStatus: ZoomConnectionStatus;
  zoomSDKElementRef: RefObject<HTMLElement> | null;
}

export const ZoomContext = createContext({} as ZoomContextType);

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
