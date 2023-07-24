import { createContext, useContext, RefObject } from 'react';

import { ZoomRole } from '@chess-tent/models';

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
