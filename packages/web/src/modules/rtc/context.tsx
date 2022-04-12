import React, { createContext, useCallback, useContext } from 'react';
import { useImmer } from 'use-immer';
import { ui } from '@application';

import type { FC } from 'react';
import type { Updater } from 'use-immer';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';

import { ConferenceButton } from './components/conference-button';
import { RTCVideo } from './components/rtc-video';

const { Icon } = ui;

interface ConferencingContextType {
  mediaConstraints: typeof DEFAULT_CONSTRAINTS;
  iceServers: typeof DEFAULT_ICE_SERVERS;
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
  update: Updater<ConferencingContextType>;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);

export const ConferencingProvider: FC = ({ children }) => {
  const [state, setState] = useImmer<ConferencingContextType>({
    connectionStarted: true,
    iceServers: DEFAULT_ICE_SERVERS,
    mediaConstraints: DEFAULT_CONSTRAINTS,
    update: (...args) => setState(...args),
  });
  const { mediaConstraints, mutedAudio, mutedVideo, localMediaStream } = state;

  const openCamera = useCallback(
    async (fromHandleOffer = false) => {
      try {
        if (!localMediaStream) {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            mediaConstraints,
          );

          if (fromHandleOffer) {
            return mediaStream;
          }

          setState(draft => {
            draft.localMediaStream = mediaStream;
          });
        }
      } catch (error) {
        console.error('getUserMedia Error: ', error);
      }
    },
    [mediaConstraints, setState, localMediaStream],
  );

  const handleStartConferencing = useCallback(
    async () => openCamera(),
    [openCamera],
  );

  const handleStopConferencing = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getTracks().forEach(track => track.stop());
    }

    setState(draft => {
      draft.localMediaStream = undefined;
    });
  }, [setState, localMediaStream]);

  const handleMuteUnmute = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getAudioTracks().forEach(audioTrack => {
        audioTrack.enabled = !!mutedAudio;
      });
    }

    setState(draft => {
      draft.mutedAudio = !mutedAudio;
    });
  }, [setState, localMediaStream, mutedAudio]);

  const handleToggleCamera = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getVideoTracks().forEach(videoTrack => {
        videoTrack.enabled = !!mutedVideo;
      });
    }

    setState(draft => {
      draft.mutedVideo = !mutedVideo;
    });
  }, [setState, localMediaStream, mutedVideo]);

  return (
    <ConferencingContext.Provider value={state}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <RTCVideo mediaStream={localMediaStream} muted />
      </div>
      <div style={{ height: 10, width: '100%' }} />
      <section style={{ display: 'flex', gap: 10 }}>
        <ConferenceButton
          className="d-flex justify-content-center align-items-center"
          onClick={handleStartConferencing}
          style={{ background: 'rgba(0, 200, 0, 0.6)', paddingTop: 3 }}
          title="Start"
        >
          <Icon type="enter" />
        </ConferenceButton>
        <ConferenceButton
          className="d-flex justify-content-center align-items-center"
          style={{
            background: mutedAudio ? 'gray' : 'rgba(0, 0, 200, 0.6)',
            paddingTop: 3,
          }}
          onClick={handleMuteUnmute}
          title="Toggle Microphone"
        >
          <Icon type="microphone" />
        </ConferenceButton>
        <ConferenceButton
          className="d-flex justify-content-center align-items-center"
          style={{
            background: mutedVideo ? 'gray' : 'rgba(200, 100, 100, 0.6)',
            paddingTop: 3,
          }}
          onClick={handleToggleCamera}
          title="Toggle Camera"
        >
          <Icon type="camera" />
        </ConferenceButton>
        <ConferenceButton
          className="d-flex justify-content-center align-items-center"
          style={{ background: 'rgba(200, 0, 0, 0.6)', paddingTop: 3 }}
          onClick={handleStopConferencing}
          title="Stop"
        >
          <Icon type="exit" />
        </ConferenceButton>
        {children}
      </section>
    </ConferencingContext.Provider>
  );
};
