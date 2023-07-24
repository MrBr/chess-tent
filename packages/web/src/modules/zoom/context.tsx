import { createContext, useContext, RefObject } from 'react';

export enum Role {
  Guest = 0,
  Host = 1,
}

export interface ZoomContextType {
  userSignature: string | null;
  hostUserZakToken: string | undefined;
  meetingNumber: string | undefined;
  username: string;
  password: string | null;
  role: Role | null;
  authCode: string | undefined;
  redirectUri: string | '';
  updateContext: Function;
  resetContext: Function;
  isOnCall: boolean;
  zoomSDKElementRef: RefObject<HTMLElement> | null;
}

export const ZoomContext = createContext({} as ZoomContextType);

export const useZoomContext = () => useContext(ZoomContext);
