import { createContext, useContext } from 'react';

export type Role = 0 | 1;

export interface ZoomContextType {
  userSignature: string;
  hostUserZakToken: string | null;
  meetingNumber: string;
  username: string;
  password: string;
  role: Role | null;
}

export const ZoomContext = createContext({} as ZoomContextType);

export const useZoomContext = () => useContext(ZoomContext);
