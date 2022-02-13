import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { hooks, socket, ui } from '@application';
import { CONFERENCING_ANSWER, CONFERENCING_ROOM } from '@chess-tent/types';
import { useImmer } from 'use-immer';

import type { ConferencingProps } from '@types';
import type {
  AnswerAction,
  ConnectionAction,
  ICECandidateAction,
  OfferAction,
} from '@chess-tent/types';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';
import { ConferenceButton } from './components/conference-button';
import { RTCVideo } from './components/rtc-video';
import { usePeerConnection } from './hook';

const { Icon } = ui;
const { useConferencing } = hooks;

type State = Partial<{
  connectionStarted: boolean;
  iceServers: { urls: string }[];
  localMediaStream: MediaStream;
  mediaConstraints: { video: boolean; audio: boolean };
  muted?: boolean;
  remoteMediaStream: MediaStream;
}>;

const Conferencing = memo(
  ({ activityId, iceServerUrls, mediaConstraints }: ConferencingProps) => {
    const [state, setState] = useImmer<State>({
      iceServers:
        iceServerUrls?.map(serverURL => ({ urls: serverURL })) ||
        DEFAULT_ICE_SERVERS,
      mediaConstraints: mediaConstraints || DEFAULT_CONSTRAINTS,
    });

    const rtcPeerConnection = useMemo(
      () =>
        new RTCPeerConnection({
          iceServers: state.iceServers,
        }),
      [state.iceServers],
    );

    const openCamera = useCallback(
      async (fromHandleOffer = false) => {
        const { mediaConstraints, localMediaStream } = state;
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
      [setState, state],
    );

    const handleOffer = useCallback(
      async (data: OfferAction) => {
        const { localMediaStream } = state;
        const { payload } = data;

        if (!payload.message) return;

        await rtcPeerConnection.setRemoteDescription(payload.message);

        let mediaStream = localMediaStream;

        if (!mediaStream) {
          mediaStream = await openCamera(true);
        }

        setState(draft => {
          draft.connectionStarted = true;
          draft.localMediaStream = mediaStream;
        });
      },
      [openCamera, rtcPeerConnection, setState, state],
    );

    const handleAnswer = useCallback(
      async (data: AnswerAction) => {
        const { payload } = data;

        await rtcPeerConnection.setRemoteDescription(payload.message);
      },
      [rtcPeerConnection],
    );

    const handleICECandidate = useCallback(
      async (data: ICECandidateAction) => {
        const { message } = data.payload;
        const candidate = JSON.parse(message);

        await rtcPeerConnection.addIceCandidate(candidate);
      },
      [rtcPeerConnection],
    );

    const handleConnectionReady = useCallback(
      (data: ConnectionAction) => {
        setState(draft => {
          draft.connectionStarted = data.payload.startConnection;
        });
      },
      [setState],
    );

    const addRemoteStream = useCallback(
      (remoteMediaStream: MediaStream) => {
        setState(draft => {
          draft.remoteMediaStream = remoteMediaStream;
        });
      },
      [setState],
    );

    const handleStartConferencing = useCallback(async () => {
      await openCamera();

      socket.sendAction({
        type: CONFERENCING_ROOM,
        payload: { activityId },
        meta: {},
      });
    }, [activityId, openCamera]);

    const handleStopConferencing = useCallback(() => {
      const { localMediaStream } = state;

      // eslint-disable-next-line no-unused-expressions
      localMediaStream?.getTracks().forEach(track => track.stop());

      setState(draft => {
        draft.localMediaStream = undefined;
      });
    }, [setState, state]);

    const handleMuteUnmute = useCallback(() => {
      const { localMediaStream, muted } = state;

      // eslint-disable-next-line no-unused-expressions
      localMediaStream?.getAudioTracks().forEach(audioTrack => {
        audioTrack.enabled = !!muted;
      });

      setState(draft => {
        draft.muted = !muted;
      });
    }, [setState, state]);

    useEffect(() => {
      const { connectionStarted, localMediaStream } = state;

      if (connectionStarted && localMediaStream && activityId) {
        const createAnswer = async () => {
          let answer: RTCSessionDescriptionInit | undefined;

          try {
            answer = await rtcPeerConnection.createAnswer();
          } catch (error) {
            console.error(error);
          }

          if (!answer) return;

          await rtcPeerConnection.setLocalDescription(answer);

          socket.sendAction({
            type: CONFERENCING_ANSWER,
            payload: {
              activityId,
              message: answer,
            },
            meta: {},
          });
        };

        createAnswer();
      }
    }, [activityId, rtcPeerConnection, state]);

    useConferencing({
      handleAnswer,
      handleConnectionReady,
      handleICECandidate,
      handleOffer,
    });

    usePeerConnection(
      activityId,
      rtcPeerConnection,
      addRemoteStream,
      state.localMediaStream,
      state.connectionStarted,
    );

    return (
      <>
        <RTCVideo mediaStream={state.localMediaStream} />
        <RTCVideo mediaStream={state.remoteMediaStream} />
        <div style={{ height: 10, width: '100%' }} />
        <section style={{ display: 'flex', gap: 10 }}>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            onClick={handleStartConferencing}
            style={{ background: 'rgba(0, 200, 0, 0.9)' }}
            title="Start"
          >
            <Icon type="enter" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{
              background: state.muted ? 'gray' : 'rgba(0, 0, 200, 0.9)',
            }}
            onClick={handleMuteUnmute}
            title="Toggle Microphone"
          >
            <Icon type="microphone" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgba(200, 0, 0, 0.9)' }}
            onClick={handleStopConferencing}
            title="Stop"
          >
            <Icon type="exit" />
          </ConferenceButton>
        </section>
      </>
    );
  },
);

export default Conferencing;
