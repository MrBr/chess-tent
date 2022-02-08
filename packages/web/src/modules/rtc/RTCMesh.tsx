import React, { useCallback, useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import 'core-js/stable';
import 'regenerator-runtime';

import { RTCVideo } from './RTCVideo';
import Websocket from './Websocket';
import PeerConnection from './PeerConnection';

import {
  DEFAULT_CONSTRAINTS,
  DEFAULT_ICE_SERVERS,
  TYPE_ROOM,
  TYPE_ANSWER,
} from './constants';

import { buildServers, createMessage, createPayload } from './helpers';

interface RequiredProps {
  activityId: string;
  webSocketUrl: string;
}

export type RTCMeshProps = RequiredProps &
  Partial<{
    iceServerUrls: string[];
    mediaConstraints: { video: boolean; audio: boolean };
  }>;

type State = Partial<{
  connectionStarted: boolean;
  iceServers: { urls: string }[];
  localMediaStream: MediaStream;
  mediaConstraints: { video: boolean; audio: boolean };
  remoteMediaStream: MediaStream;
  roomKey: string;
  socketId: string;
}>;

const RTCMesh = ({
  activityId,
  iceServerUrls,
  mediaConstraints,
  webSocketUrl,
}: RTCMeshProps) => {
  const [state, setState] = useImmer<State>({
    iceServers: buildServers(iceServerUrls) || DEFAULT_ICE_SERVERS,
    mediaConstraints: mediaConstraints || DEFAULT_CONSTRAINTS,
  });

  const socket = useMemo(() => new WebSocket(webSocketUrl), [webSocketUrl]);
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
    async (data: any) => {
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
    async (data: any) => {
      const { payload } = data;

      await rtcPeerConnection.setRemoteDescription(payload.message);
    },
    [rtcPeerConnection],
  );

  const handleIceCandidate = useCallback(
    async (data: any) => {
      const { message } = data.payload;
      const candidate = JSON.parse(message);

      await rtcPeerConnection.addIceCandidate(candidate);
    },
    [rtcPeerConnection],
  );

  const handleSocketConnection = useCallback(
    (socketId: string) => {
      setState(draft => {
        draft.socketId = socketId;
      });
    },
    [setState],
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
    const { socketId } = state;

    if (!socketId) return;

    await openCamera();

    const roomKeyMessage = createMessage(
      TYPE_ROOM,
      createPayload(activityId, socketId),
    );
    socket.send(JSON.stringify(roomKeyMessage));
    setState(draft => {
      draft.roomKey = activityId;
    });
  }, [activityId, openCamera, setState, socket, state]);

  const handleStopConferencing = useCallback(() => {
    const { localMediaStream } = state;

    // eslint-disable-next-line no-unused-expressions
    localMediaStream?.getTracks().forEach(track => track.stop());

    setState(draft => {
      draft.localMediaStream = undefined;
    });
  }, [setState, state]);

  useEffect(() => {
    const { connectionStarted, localMediaStream, roomKey, socketId } = state;

    if (connectionStarted && localMediaStream && roomKey && socketId) {
      const createAnswer = async () => {
        const answer = await rtcPeerConnection.createAnswer();

        await rtcPeerConnection.setLocalDescription(answer);

        const payload = createPayload(roomKey, socketId, answer);
        const answerMessage = createMessage(TYPE_ANSWER, payload);
        socket.send(JSON.stringify(answerMessage));
      };

      try {
        createAnswer();
      } catch {}

      // TODO: disconnect on unmount (WebSocket / P2P)
    }
  }, [rtcPeerConnection, socket, state]);

  const sendMessage = socket.send.bind(socket);

  return (
    <>
      <Websocket
        socket={socket}
        handleSocketConnection={handleSocketConnection}
        handleConnectionReady={handleConnectionReady}
        handleOffer={handleOffer}
        handleAnswer={handleAnswer}
        handleIceCandidate={handleIceCandidate}
      />
      <PeerConnection
        rtcPeerConnection={rtcPeerConnection}
        iceServers={state.iceServers}
        localMediaStream={state.localMediaStream}
        addRemoteStream={addRemoteStream}
        startConnection={state.connectionStarted}
        sendMessage={sendMessage}
        roomInfo={{ socketId: state.socketId, roomKey: state.roomKey }}
      />
      <RTCVideo mediaStream={state.localMediaStream} />
      <RTCVideo mediaStream={state.remoteMediaStream} />
      <div style={{ height: 10, width: '100%' }} />
      <section style={{ display: 'flex', gap: 10 }}>
        <div
          onClick={handleStartConferencing}
          style={{
            width: 30,
            height: 30,
            background: 'green',
            borderRadius: '100%',
          }}
        ></div>
        <div
          style={{
            width: 30,
            height: 30,
            background: 'red',
            borderRadius: '100%',
          }}
          onClick={handleStopConferencing}
        ></div>
      </section>
    </>
  );
};

export default RTCMesh;
