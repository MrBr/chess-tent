import { createContext, useContext } from 'react';

export interface ConferencingContextType {
  mediaConstraints: MediaStreamConstraints;
  iceServers: RTCIceServer[];
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);
