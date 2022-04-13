import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';

import { ConferenceButton } from './components/conference-button';
import { ConferencingPeer } from './conferencing-peer';
import { RTCVideo } from './components/rtc-video';

const { Icon } = ui;
const { useActiveUserRecord, useSocketRoomUsers } = hooks;
const { UserAvatar } = components;

interface ConferencingContextType {
  mediaConstraints: typeof DEFAULT_CONSTRAINTS;
  iceServers: typeof DEFAULT_ICE_SERVERS;
  localMediaStream?: MediaStream;
  connectionStarted?: boolean;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
}

export const ConferencingContext = createContext({} as ConferencingContextType);

export const useConferencingContext = () => useContext(ConferencingContext);

export const ConferencingProvider: Components['ConferencingProvider'] = ({
  room,
}) => {
  const [state, setState] = useState<ConferencingContextType>({
    connectionStarted: true,
    iceServers: DEFAULT_ICE_SERVERS,
    mediaConstraints: DEFAULT_CONSTRAINTS,
  });
  const { value: user } = useActiveUserRecord();
  const { mediaConstraints, mutedAudio, mutedVideo, localMediaStream } = state;
  const liveUsers = useSocketRoomUsers(room);

  const remoteUsers = useMemo(
    () => liveUsers.filter(({ id }) => id !== user.id),
    [liveUsers, user.id],
  );

  // Close media tracks on unmount
  useEffect(
    () => localMediaStream?.getTracks().forEach(track => track.stop()),
    [localMediaStream],
  );

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

          setState(pevState => ({
            ...pevState,
            localMediaStream: mediaStream,
          }));
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

    setState(pevState => ({
      ...pevState,
      localMediaStream: undefined,
    }));
  }, [setState, localMediaStream]);

  const handleMuteUnmute = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getAudioTracks().forEach(audioTrack => {
        audioTrack.enabled = !!mutedAudio;
      });
    }

    setState(pevState => ({
      ...pevState,
      mutedAudio: !mutedAudio,
    }));
  }, [setState, localMediaStream, mutedAudio]);

  const handleToggleCamera = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getVideoTracks().forEach(videoTrack => {
        videoTrack.enabled = !!mutedVideo;
      });
    }

    setState(pevState => ({
      ...pevState,
      mutedVideo: !mutedAudio,
    }));
  }, [localMediaStream, mutedVideo, mutedAudio]);

  return (
    <ConferencingContext.Provider value={state}>
      {liveUsers.map(user => (
        <UserAvatar key={user.id} user={user} />
      ))}
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
        {remoteUsers.map(({ id }) => (
          <ConferencingPeer
            key={id}
            room={room}
            fromUserId={id}
            toUserId={user.id as string}
          />
        ))}
      </section>
    </ConferencingContext.Provider>
  );
};
