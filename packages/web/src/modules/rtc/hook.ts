import { useCallback, useEffect, useMemo, useState } from 'react';
import { hooks, socket } from '@application';
import {
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
  AnswerAction,
  ICECandidateAction,
  OfferAction,
} from '@chess-tent/types';

import { useConferencingContext } from './context';

const { useConferencing } = hooks;

export const usePeerConnection = (
  room: string,
  fromUserId: string,
  toUserId: string,
) => {
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream>();
  const { connectionStarted, iceServers, localMediaStream } =
    useConferencingContext();
  const rtcPeerConnection = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleOffer = useCallback(
    async (data: OfferAction) => {
      const { payload } = data;

      if (!payload.message) return;

      await rtcPeerConnection.setRemoteDescription(payload.message);
    },
    [rtcPeerConnection],
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

  const addRemoteStream = useCallback((remoteMediaStream: MediaStream) => {
    setRemoteMediaStream(remoteMediaStream);
  }, []);

  const handleOnNegotiationNeeded = useCallback(async () => {
    try {
      const offer = await rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await rtcPeerConnection.setLocalDescription(offer);

      socket.sendAction({
        type: CONFERENCING_OFFER,
        payload: {
          room,
          message: rtcPeerConnection.localDescription,
          fromUserId,
          toUserId,
        },
        meta: {},
      });
    } catch (error) {
      console.error(error);
    }
  }, [fromUserId, rtcPeerConnection, toUserId, room]);

  const handleOnIceEvent = useCallback(
    (rtcPeerConnectionIceEvent: RTCPeerConnectionIceEvent) => {
      if (rtcPeerConnectionIceEvent.candidate) {
        socket.sendAction({
          type: CONFERENCING_ICECANDIDATE,
          payload: {
            room,
            message: JSON.stringify(rtcPeerConnectionIceEvent.candidate),
            fromUserId,
            toUserId,
          },
          meta: {},
        });
      }
    },
    [fromUserId, toUserId, room],
  );

  const handleOnTrack = useCallback(
    (trackEvent: RTCTrackEvent) => {
      addRemoteStream(trackEvent.streams[0]);
    },
    [addRemoteStream],
  );

  useEffect(() => {
    if (!rtcPeerConnection) {
      throw new Error('RTC should be initialized!');
    }

    rtcPeerConnection.onnegotiationneeded = handleOnNegotiationNeeded;
    rtcPeerConnection.onicecandidate = handleOnIceEvent;
    rtcPeerConnection.ontrack = handleOnTrack;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useConferencing(fromUserId, toUserId, {
    handleAnswer,
    handleICECandidate,
    handleOffer,
  });

  useEffect(() => {
    if (!connectionStarted || !localMediaStream) return;

    localMediaStream
      .getTracks()
      .forEach(mediaStreamTrack =>
        rtcPeerConnection.addTrack(mediaStreamTrack, localMediaStream),
      );
  }, [rtcPeerConnection, connectionStarted, localMediaStream]);

  useEffect(() => {
    if (connectionStarted && localMediaStream) {
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
            room,
            fromUserId,
            toUserId,
            message: answer,
          },
          meta: {},
        });
      };

      createAnswer();
    }

    return () => {
      if (rtcPeerConnection) {
        rtcPeerConnection.close();
      }
    };
  }, [
    rtcPeerConnection,
    connectionStarted,
    localMediaStream,
    fromUserId,
    toUserId,
    room,
  ]);

  return remoteMediaStream;
};
