import { createContext, useContext } from 'react';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';

export interface ConferencingContextType {
  mediaConstraints: typeof DEFAULT_CONSTRAINTS;
  iceServers: typeof DEFAULT_ICE_SERVERS;
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);
