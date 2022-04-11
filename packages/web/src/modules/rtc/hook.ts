import { useCallback, useEffect, useRef } from 'react';
import { socket } from '@application';
import {
  CONFERENCING_ICECANDIDATE,
  CONFERENCING_OFFER,
} from '@chess-tent/types';

export const usePeerConnection = (
  activityId: string,
  rtcPeerConnection: RTCPeerConnection,
  addRemoteStream: (remoteMediaStream: MediaStream) => void,
  localMediaStream?: MediaStream,
  startConnection?: boolean,
) => {
  const senders = useRef<RTCRtpSender[]>([]);

  // adds localMediaStream to RTC connection
  const addMediaStreamTrack = useCallback(() => {
    if (localMediaStream) {
      localMediaStream.getTracks().forEach(mediaStreamTrack => {
        senders.current.push(rtcPeerConnection.addTrack(mediaStreamTrack));
      });
    }
  }, [localMediaStream, rtcPeerConnection]);

  const handleOnNegotiationNeeded = useCallback(async () => {
    try {
      const offer = await rtcPeerConnection.createOffer();

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
      const remoteMediaStream = new MediaStream([trackEvent.track]);
      addRemoteStream(remoteMediaStream);
    },
    [addRemoteStream],
  );

  useEffect(() => {
    rtcPeerConnection.onnegotiationneeded = handleOnNegotiationNeeded;
    rtcPeerConnection.onicecandidate = handleOnIceEvent;
    rtcPeerConnection.ontrack = handleOnTrack;

    return () => {
      rtcPeerConnection.onnegotiationneeded = null;
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.ontrack = null;
    };
  }, [
    handleOnIceEvent,
    handleOnNegotiationNeeded,
    handleOnTrack,
    rtcPeerConnection,
  ]);

  useEffect(() => {
    const activeSenders = senders.current;

    if (startConnection) {
      addMediaStreamTrack();
    }

    return () => {
      if (rtcPeerConnection && activeSenders.length) {
        activeSenders.forEach(sender => {
          rtcPeerConnection.removeTrack(sender);
        });

        senders.current = [];
      }
    };
  }, [addMediaStreamTrack, rtcPeerConnection, startConnection]);
};
