import { createContext, useContext } from 'react';

import { DEFAULT_ICE_SERVERS, RTC_CONSTRAINTS } from './constants';

export interface ConferencingContextType {
  mediaConstraints: RTC_CONSTRAINTS;
  iceServers: typeof DEFAULT_ICE_SERVERS;
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);
