import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from '../constants';

import ConferencingPeer from './conferencing-peer';
import RTCVideo from './rtc-video';
import { ConferencingContextType, ConferencingContext } from '../context';

const { Icon, Stack, Dropdown, Button, Row, Col } = ui;
const { useActiveUserRecord, useSocketRoomUsers } = hooks;
const { UserAvatar } = components;

const ConferencingProvider: Components['ConferencingProvider'] = ({ room }) => {
  const [showConfMenu, setShowConfMenu] = useState(false);
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

  const handleStartConferencing = useCallback(() => {
    setState(pevState => ({
      ...pevState,
      connectionStarted: true,
    }));
  }, []);

  const handleStopConferencing = useCallback(() => {
    localMediaStream?.getTracks().forEach(track => track.stop());

    setState(pevState => ({
      ...pevState,
      localMediaStream: undefined,
      connectionStarted: false,
      mutedAudio: false,
      mutedVideo: false,
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

  const toggleShowConfMenu = useCallback(
    () => setShowConfMenu(prevVal => !prevVal),
    [setShowConfMenu],
  );

  useEffect(() => {
    if (showConfMenu && !connectionStarted) {
      openCamera();
    }

    if (!showConfMenu && !connectionStarted) {
      handleStopConferencing();
    }
  }, [showConfMenu, handleStopConferencing, openCamera, connectionStarted]);

  return (
    <ConferencingContext.Provider value={state}>
      <Row>
        <Col>
          <Dropdown show={showConfMenu} onToggle={toggleShowConfMenu}>
            <Dropdown.Toggle collapse onClick={toggleShowConfMenu}>
              <Icon type={connectionStarted ? 'close' : 'headphone'} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-3">
              {!connectionStarted && (
                <>
                  <Row className="flex-no-wrap">
                    <Col className="col-auto">
                      <Icon
                        type={mutedAudio ? 'micOff' : 'microphone'}
                        onClick={handleMuteUnmute}
                      />
                    </Col>
                    <Col className="col-auto">
                      <Icon
                        type={mutedVideo ? 'hide' : 'videoCamera'}
                        onClick={handleToggleCamera}
                      />
                    </Col>
                    <Col onClick={toggleShowConfMenu}>
                      <Button
                        size="extra-small"
                        onClick={handleStartConferencing}
                      >
                        Join
                      </Button>
                    </Col>
                  </Row>
                  <RTCVideo
                    mediaStream={localMediaStream}
                    muted
                    className="position-relative mt-3"
                  />
                </>
              )}
              {connectionStarted && (
                <Row>
                  <Col>
                    <Button
                      onClick={handleStopConferencing}
                      size="extra-small"
                      variant="tertiary"
                    >
                      Leave
                    </Button>
                  </Col>
                </Row>
              )}
            </Dropdown.Menu>
          </Dropdown>
          {connectionStarted && (
            <>
              <div style={{ position: 'relative' }}>
                {!mutedVideo && (
                  <RTCVideo mediaStream={localMediaStream} muted />
                )}
                <Icon
                  type={mutedAudio ? 'micOff' : 'microphone'}
                  onClick={handleMuteUnmute}
                />
                <Icon
                  type={mutedVideo ? 'hide' : 'videoCamera'}
                  onClick={handleToggleCamera}
                />

                {localMediaStream &&
                  remoteUsers.map(({ id }) => (
                    <ConferencingPeer
                      key={id}
                      room={room}
                      fromUserId={id}
                      toUserId={user.id as string}
                    />
                  ))}
              </div>
            </>
          )}
        </Col>
        <Col className="col-auto">
          <Stack>
            {liveUsers.map(user => (
              <UserAvatar key={user.id} user={user} size="small" />
            ))}
          </Stack>
        </Col>
      </Row>
    </ConferencingContext.Provider>
  );
};

export default ConferencingProvider;
