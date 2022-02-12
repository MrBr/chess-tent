import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { CONFERENCING_ANSWER, CONFERENCING_ROOM } from '@chess-tent/types';
import styled from '@emotion/styled';
import io from 'socket.io-client';
import { useImmer } from 'use-immer';

import { constants, ui } from '@application';

import type { ConferencingProps } from '@types';
import type {
  AnswerAction,
  ICECandidateAction,
  OfferAction,
} from '@chess-tent/types';

import { RTCVideo } from './RTCVideo';
import Websocket from './Websocket';
import PeerConnection from './PeerConnection';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';

import { buildServers, createMessage, createPayload } from './helpers';

const { APP_URL } = constants;
const { Icon } = ui;

// TODO: use scoped function instead of exposing this here
const socket = io(APP_URL, {
  path: '/api/socket.io',
  secure: process.env.REACT_APP_PROTOCOL === 'https://',
  transports: ['websocket'],
  autoConnect: false,
});

const ConferenceButton = styled.div({
  borderRadius: '100%',
  cursor: 'pointer',
  height: 40,
  paddingBottom: 3,
  width: 40,
});

type State = Partial<{
  connectionStarted: boolean;
  iceServers: { urls: string }[];
  localMediaStream: MediaStream;
  mediaConstraints: { video: boolean; audio: boolean };
  muted?: boolean;
  remoteMediaStream: MediaStream;
}>;

export const Conferencing = memo(
  ({ activityId, iceServerUrls, mediaConstraints }: ConferencingProps) => {
    const [state, setState] = useImmer<State>({
      iceServers: buildServers(iceServerUrls) || DEFAULT_ICE_SERVERS,
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
      (message: { startConnection?: boolean }) => {
        if (message.startConnection) {
          setState(draft => {
            draft.connectionStarted = message.startConnection;
          });
        }
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

      const roomKeyMessage = createMessage(
        CONFERENCING_ROOM,
        createPayload(activityId, ''),
      );
      socket.send(JSON.stringify(roomKeyMessage));
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
        try {
          const createAnswer = async () => {
            const answer = await rtcPeerConnection.createAnswer();

            await rtcPeerConnection.setLocalDescription(answer);

            const payload = createPayload(activityId, '', answer);
            const answerMessage = createMessage(CONFERENCING_ANSWER, payload);
            socket.send(JSON.stringify(answerMessage));
          };

          createAnswer();
        } catch {}

        // TODO: disconnect on unmount (WebSocket / P2P)
      }
    }, [activityId, rtcPeerConnection, state]);

    useEffect(() => {
      socket.connect();

      return () => {
        socket.disconnect();
      };
    }, []);

    const sendMessage = socket.send.bind(socket);

    return (
      <>
        <Websocket
          socket={socket}
          handleConnectionReady={handleConnectionReady}
          handleOffer={handleOffer}
          handleAnswer={handleAnswer}
          handleICECandidate={handleICECandidate}
        />
        <PeerConnection
          activityId={activityId}
          rtcPeerConnection={rtcPeerConnection}
          iceServers={state.iceServers}
          localMediaStream={state.localMediaStream}
          addRemoteStream={addRemoteStream}
          startConnection={state.connectionStarted}
          sendMessage={sendMessage}
        />
        <RTCVideo mediaStream={state.localMediaStream} />
        <RTCVideo mediaStream={state.remoteMediaStream} />
        <div style={{ height: 10, width: '100%' }} />
        <section style={{ display: 'flex', gap: 10 }}>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            onClick={handleStartConferencing}
            style={{ background: 'rgba(0, 200, 0, 0.9)' }}
          >
            <Icon color="white" type="enter" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{
              background: state.muted ? 'gray' : 'rgba(0, 0, 200, 0.9)',
            }}
            onClick={handleMuteUnmute}
          >
            <Icon color="white" type="microphone" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgba(200, 0, 0, 0.9)' }}
            onClick={handleStopConferencing}
          >
            <Icon color="white" type="exit" />
          </ConferenceButton>
        </section>
      </>
    );
  },
);
