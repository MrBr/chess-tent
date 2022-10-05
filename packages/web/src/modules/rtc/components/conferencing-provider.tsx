import React, { useCallback, useState, useEffect } from 'react';
import { hooks, ui, utils } from '@application';
import { Components } from '@types';
import { isMobile } from 'react-device-detect';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from '../constants';

import ConferencingPeer from './conferencing-peer';
import RTCVideo from './rtc-video';
import { ConferencingContextType, ConferencingContext } from '../context';

const { Icon, Dropdown, Button, Row, Col, Absolute } = ui;
const { useActiveUserRecord, useSocketRoomUsers } = hooks;
const { noop } = utils;

const ConferencingProvider: Components['ConferencingProvider'] = ({ room }) => {
  const [showConfMenu, setShowConfMenu] = useState(false);
  const [state, setState] = useState<ConferencingContextType>({
    mutedVideo: isMobile,
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
  const currentUserIndex = liveUsers.findIndex(({ id }) => id === user.id);

  // Close media tracks on unmount
  useEffect(
    () => () => localMediaStream?.getTracks().forEach(track => track.stop()),
    [localMediaStream],
  );

  useEffect(() => {
    localMediaStream?.getAudioTracks().forEach(audioTrack => {
      audioTrack.enabled = !mutedAudio;
    });
    localMediaStream?.getVideoTracks().forEach(videoTrack => {
      videoTrack.enabled = !mutedVideo;
    });
  }, [localMediaStream, mutedAudio, mutedVideo]);

  const openCamera = useCallback(async () => {
    try {
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
  }, [mediaConstraints]);

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
    }));
  }, [setState, localMediaStream]);

  const handleMuteUnmute = useCallback(() => {
    setState(pevState => ({
      ...pevState,
      mutedAudio: !mutedAudio,
    }));
  }, [setState, mutedAudio]);

  const handleToggleCamera = useCallback(() => {
    setState(pevState => ({
      ...pevState,
      mutedVideo: !mutedVideo,
    }));
  }, [mutedVideo]);

  const toggleShowConfMenu = useCallback(() => {
    setShowConfMenu(prevVal => !prevVal);
  }, [setShowConfMenu]);

  useEffect(() => {
    if (!localMediaStream && showConfMenu && !connectionStarted) {
      openCamera();
    }

    if (!showConfMenu && !connectionStarted) {
      handleStopConferencing();
    }
  }, [
    showConfMenu,
    handleStopConferencing,
    openCamera,
    connectionStarted,
    localMediaStream,
  ]);

  return (
    <ConferencingContext.Provider value={state}>
      <Row className="justify-content-between">
        <Col className="col-auto">
          <Dropdown show={showConfMenu} onToggle={toggleShowConfMenu}>
            <Dropdown.Toggle collapse onClick={noop}>
              {!connectionStarted && (
                <Icon type="headphone" onClick={toggleShowConfMenu} />
              )}
              {connectionStarted && (
                <>
                  <Icon type="close" onClick={handleStopConferencing} />
                  <Icon
                    type={mutedAudio ? 'micOff' : 'microphone'}
                    onClick={handleMuteUnmute}
                  />
                  {!isMobile && (
                    <Icon
                      type={mutedVideo ? 'hide' : 'videoCamera'}
                      onClick={handleToggleCamera}
                    />
                  )}
                </>
              )}
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
                      {!isMobile && (
                        <Icon
                          type={mutedVideo ? 'hide' : 'videoCamera'}
                          onClick={handleToggleCamera}
                        />
                      )}
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
                    draggable={false}
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
        </Col>
        {connectionStarted && (
          <Col>
            <div style={{ position: 'relative' }}>
              <Absolute left={0}>
                {!mutedVideo && (
                  <RTCVideo mediaStream={localMediaStream} muted />
                )}
              </Absolute>

              {localMediaStream &&
                liveUsers.map(
                  ({ id }, index) =>
                    id !== user.id && (
                      <Absolute left={60 * (index + 1)} key={id}>
                        <ConferencingPeer
                          room={room}
                          fromUserId={id}
                          toUserId={user.id as string}
                          polite={index > currentUserIndex}
                        />
                      </Absolute>
                    ),
                )}
            </div>
          </Col>
        )}
      </Row>
    </ConferencingContext.Provider>
  );
};

export default ConferencingProvider;
