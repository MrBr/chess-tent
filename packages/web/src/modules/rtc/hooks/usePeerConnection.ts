import { useEffect, useState, useMemo, useCallback } from 'react';
import { hooks } from '@application';
import {
  Actions,
  CONFERENCING_ANSWER,
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';

import { useConferencingContext } from '../context';
import { isConferencingAction, RTCController } from '../service';

const { useSocketActionListener } = hooks;

export const usePeerConnection = (
  room: string,
  fromUserId: string,
  toUserId: string,
) => {
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream>();
  const { iceServers, localMediaStream } = useConferencingContext();
  const rtcController = useMemo(() => {
    return new RTCController(
      {
        iceServers: iceServers,
      },
      room,
      fromUserId,
      toUserId,
      (trackEvent?: RTCTrackEvent) => {
        setRemoteMediaStream(trackEvent?.streams[0]);
      },
    );
  }, [fromUserId, iceServers, room, toUserId]);

  // Setup RTC tracks once the local media stream is up
  useEffect(() => {
    if (!localMediaStream) {
      return;
    }
    rtcController.setMediaStream(localMediaStream);
  }, [rtcController, localMediaStream]);

  useEffect(() => {
    rtcController.init();
    return () => {
      rtcController.close();
    };
  }, [rtcController]);

  const listener = useCallback(
    (data: Actions | string) => {
      if (typeof data === 'string' || !isConferencingAction(data)) return;
      if (
        (data.payload?.fromUserId === fromUserId ||
          data.payload?.fromUserId === toUserId) &&
        (data.payload?.toUserId === toUserId ||
          data.payload?.toUserId === fromUserId)
      ) {
        try {
          switch (data.type) {
            case CONFERENCING_OFFER:
              rtcController.handleOffer(data.payload.message);
              break;
            case CONFERENCING_ANSWER:
              rtcController.handleAnswer(data.payload.message);
              break;
            case CONFERENCING_ICECANDIDATE:
              rtcController.handleICECandidate(data.payload.message);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error(error);
        }
      }
    },
    [fromUserId, rtcController, toUserId],
  );

  useSocketActionListener(listener);

  return remoteMediaStream;
};
