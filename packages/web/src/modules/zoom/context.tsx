import { createContext, useContext, RefObject } from 'react';

import { ZoomRole } from '@chess-tent/models';

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
  isOnCall: boolean;
  zoomSDKElementRef: RefObject<HTMLElement> | null;
}

export const ZoomContext = createContext({} as ZoomContextType);

export const useZoomContext = () => useContext(ZoomContext);
