import { createContext, useContext } from 'react';

export interface ConferencingContextType {
  mediaConstraints: MediaStreamConstraints;
  iceServers: RTCIceServer[];
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
  error?: string | null;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);
