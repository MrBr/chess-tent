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

import { ConferencingPeer } from './conferencing-peer';
import { RTCVideo } from './components/rtc-video';

const { Icon, Stack } = ui;
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
    mutedVideo: false,
    mutedAudio: false,
    connectionStarted: false,
    iceServers: DEFAULT_ICE_SERVERS,
    mediaConstraints: DEFAULT_CONSTRAINTS,
  });
  const { value: user } = useActiveUserRecord();
  const {
    mediaConstraints,
    mutedAudio,
    mutedVideo,
    localMediaStream,
    connectionStarted,
  } = state;
  const liveUsers = useSocketRoomUsers(room);

  const remoteUsers = useMemo(
    () => liveUsers.filter(({ id }) => id !== user.id),
    [liveUsers, user.id],
  );

  // Close media tracks on unmount
  useEffect(
    () => () => localMediaStream?.getTracks().forEach(track => track.stop()),
    [localMediaStream],
  );

  const openCamera = useCallback(async () => {
    try {
      if (localMediaStream) {
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints,
      );

      setState(pevState => ({
        ...pevState,
        localMediaStream: mediaStream,
      }));
    } catch (error) {
      console.error('getUserMedia Error: ', error);
    }
  }, [mediaConstraints, setState, localMediaStream]);

  const handleStartConferencing = useCallback(async () => {
    await openCamera();
    setState(pevState => ({
      ...pevState,
      connectionStarted: true,
    }));
  }, [openCamera]);

  const handleStopConferencing = useCallback(() => {
    localMediaStream?.getTracks().forEach(track => track.stop());

    setState(pevState => ({
      ...pevState,
      localMediaStream: undefined,
    }));
  }, [setState, localMediaStream]);

  const handleMuteUnmute = useCallback(() => {
    localMediaStream?.getAudioTracks().forEach(audioTrack => {
      audioTrack.enabled = !!mutedAudio;
    });

    setState(pevState => ({
      ...pevState,
      mutedAudio: !mutedAudio,
    }));
  }, [setState, localMediaStream, mutedAudio]);

  const handleToggleCamera = useCallback(() => {
    localMediaStream?.getVideoTracks().forEach(videoTrack => {
      videoTrack.enabled = !!mutedVideo;
    });

    setState(pevState => ({
      ...pevState,
      mutedVideo: !mutedVideo,
    }));
  }, [localMediaStream, mutedVideo]);

  return (
    <ConferencingContext.Provider value={state}>
      <Stack>
        {liveUsers.map(user => (
          <UserAvatar key={user.id} user={user} />
        ))}
      </Stack>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <RTCVideo mediaStream={localMediaStream} muted />
      </div>
      <div style={{ height: 10, width: '100%' }} />
      <section style={{ display: 'flex', gap: 10 }}>
        <Icon
          type="headphone"
          onClick={
            connectionStarted ? handleStopConferencing : handleStartConferencing
          }
        />
        <Icon type="microphone" onClick={handleMuteUnmute} />
        <Icon type="video" onClick={handleToggleCamera} />
        {connectionStarted &&
          remoteUsers.map(({ id }) => (
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
