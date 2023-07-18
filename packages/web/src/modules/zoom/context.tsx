import { createContext, useContext } from 'react';

export enum Role {
  Guest = 0,
  Host = 1,
}

export interface ZoomContextType {
  userSignature: string;
  hostUserZakToken: string | null;
  meetingNumber: string;
  username: string;
  password: string;
  role: Role | null;
  authCode: string | undefined;
  redirectUri: string | '';
  updateContext: Function;
  resetContext: Function;
}

export const ZoomContext = createContext({} as ZoomContextType);

export const useZoomContext = () => useContext(ZoomContext);
