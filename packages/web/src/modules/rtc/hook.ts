import { useCallback, useEffect, useMemo } from 'react';
import { hooks, socket } from '@application';
import {
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';
import { useImmer } from 'use-immer';

import type {
  AnswerAction,
  ICECandidateAction,
  OfferAction,
} from '@chess-tent/types';

const { useConferencing } = hooks;

type State = Partial<{
  connectionStarted: boolean;
  localMediaStream: MediaStream;
  mutedAudio?: boolean;
  mutedVideo?: boolean;
  remoteMediaStream: MediaStream;
}>;

export const usePeerConnection = (
  activityId: string,
  iceServers: { urls: string }[],
  mediaConstraints: { video: boolean; audio: boolean },
) => {
  const [state, setState] = useImmer<State>({});
  const { connectionStarted, localMediaStream, mutedAudio, mutedVideo } = state;
  const rtcPeerConnection = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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

  const handleOffer = useCallback(
    async (data: OfferAction) => {
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
    [openCamera, rtcPeerConnection, setState, localMediaStream],
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

  const handleConnectionReady = useCallback(() => {
    setState(draft => {
      draft.connectionStarted = true;
    });
  }, [setState]);

  const addRemoteStream = useCallback(
    (remoteMediaStream: MediaStream) => {
      setState(draft => {
        draft.remoteMediaStream = remoteMediaStream;
      });
    },
    [setState],
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

  const handleOnNegotiationNeeded = useCallback(async () => {
    try {
      const offer = await rtcPeerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await rtcPeerConnection.setLocalDescription(offer);

      socket.sendAction({
        type: CONFERENCING_OFFER,
        payload: { activityId, message: rtcPeerConnection.localDescription },
        meta: {},
      });
    } catch (error) {
      console.error(error);
    }
  }, [activityId, rtcPeerConnection]);

  const handleOnIceEvent = useCallback(
    (rtcPeerConnectionIceEvent: RTCPeerConnectionIceEvent) => {
      if (rtcPeerConnectionIceEvent.candidate) {
        socket.sendAction({
          type: CONFERENCING_ICECANDIDATE,
          payload: {
            activityId,
            message: JSON.stringify(rtcPeerConnectionIceEvent.candidate),
          },
          meta: {},
        });
      }
    },
    [activityId],
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

  useConferencing({
    handleAnswer,
    handleConnectionReady,
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
            activityId,
            message: answer,
          },
          meta: {},
        });
      };

      createAnswer();
    }

    // TODO: we need to close this when user leaves room via messaging
    // return () => {
    //   if (rtcPeerConnection) {
    //     rtcPeerConnection.close();
    //   }
    // };
  }, [activityId, rtcPeerConnection, connectionStarted, localMediaStream]);

  return {
    state,
    handleStartConferencing,
    handleMuteUnmute,
    handleStopConferencing,
    handleToggleCamera,
  };
};
