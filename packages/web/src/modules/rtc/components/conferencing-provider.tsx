import React, { useCallback, useState, useEffect } from 'react';
import { hooks, ui, utils } from '@application';
import { Components } from '@types';
import { isMobile } from 'react-device-detect';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from '../constants';

import ConferencingPeer from './conferencing-peer';
import RTCVideo from './rtc-video';
import { ConferencingContextType, ConferencingContext } from '../context';

const { Icon, Dropdown, Button, Row, Col, Container, Text, Alert } = ui;
const { useActiveUserRecord, useSocketRoomUsers } = hooks;
const { noop } = utils;

const ConferencingProvider: Components['ConferencingProvider'] = ({ room }) => {
  const [showConfMenu, setShowConfMenu] = useState(false);
  // Prevents warning flickering because getMedia is async
  // Show if user doesn't respond in some time
  const [showMediaAccessWarning, setMediaAccessWarning] = useState(false);
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
    error,
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
      let mediaStream: MediaStream;
      setTimeout(() => {
        setMediaAccessWarning(!mediaStream);
      }, 750);

      mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);

      setState(pevState => ({
        ...pevState,
        localMediaStream: mediaStream,
        error: null,
      }));
    } catch (error) {
      setState(pevState => ({
        ...pevState,
        error: (error as Error)?.message || "Couldn't get user media.",
      }));
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

  const multimediaSettings = (
    <>
      <Col className="text-center">
        <Icon
          type={mutedAudio ? 'micOff' : 'microphone'}
          onClick={handleMuteUnmute}
        />
      </Col>
      <Col className="text-center">
        {!isMobile && (
          <Icon
            type={mutedVideo ? 'hide' : 'videoCamera'}
            onClick={handleToggleCamera}
          />
        )}
      </Col>
    </>
  );

  const alerts = (
    <>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {!error && !localMediaStream && showMediaAccessWarning && (
        <Alert variant="warning"> Allow access to camera/microphone.</Alert>
      )}
    </>
  );

  return (
    <ConferencingContext.Provider value={state}>
      <Container fluid className="g-0">
        {connectionStarted && (
          <Row className="d-flex g-1 align-items-center">
            {!mutedVideo && (
              <Col className="col-auto">
                <RTCVideo mediaStream={localMediaStream} muted />
              </Col>
            )}
            {localMediaStream &&
              liveUsers.map(
                ({ id }, index) =>
                  id !== user.id && (
                    <Col className="col-auto" key={id}>
                      <ConferencingPeer
                        room={room}
                        fromUserId={id}
                        toUserId={user.id as string}
                        polite={index > currentUserIndex}
                      />
                    </Col>
                  ),
              )}
            <Col className="col-auto ms-auto">
              {connectionStarted && (
                <>
                  <Row className="mw-100 g-2 flex-column justify-content-between">
                    <Col className="text-center">
                      <Icon type="close" onClick={handleStopConferencing} />
                    </Col>
                    {multimediaSettings}
                  </Row>
                  {alerts}
                </>
              )}
            </Col>
          </Row>
        )}
        {!connectionStarted && (
          <Row className="justify-content-between mw-100 g-0">
            <Dropdown show={showConfMenu} onToggle={toggleShowConfMenu}>
              <Dropdown.Toggle collapse onClick={noop}>
                <div className="d-flex justify-content-center w-100">
                  <Button
                    variant="tertiary"
                    size="extra-small"
                    onClick={toggleShowConfMenu}
                  >
                    <Icon textual type="headphone" className="me-2" /> Join
                  </Button>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="p-3">
                {!connectionStarted && (
                  <>
                    <Row>
                      <Col>
                        <Text fontSize="extra-small" className="mb-3">
                          Conference for live training
                        </Text>
                      </Col>
                    </Row>
                    <Row className="flex-no-wrap">
                      {multimediaSettings}
                      <Col onClick={toggleShowConfMenu}>
                        <Button
                          size="extra-small"
                          onClick={handleStartConferencing}
                          disabled={!localMediaStream}
                        >
                          Join
                        </Button>
                      </Col>
                    </Row>
                    {alerts}
                    <RTCVideo
                      mediaStream={localMediaStream}
                      muted
                      className="position-relative mt-3"
                    />
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Row>
        )}
      </Container>
    </ConferencingContext.Provider>
  );
};

export default ConferencingProvider;
