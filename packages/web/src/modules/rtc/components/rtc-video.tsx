import React, { useCallback } from 'react';

export interface RTCVideoProps {
  mediaStream?: MediaStream;
}

export const RTCVideo: React.FC<RTCVideoProps> = ({ mediaStream }) => {
  const addMediaStream = useCallback(
    (video: HTMLVideoElement | null) => {
      if (mediaStream && video) {
        video.srcObject = mediaStream;
      }
    },
    [mediaStream],
  );

  return (
    <video
      style={{
        width: 480,
        height: 360,
        borderRadius: 4,
        backgroundColor: 'black',
      }}
      autoPlay
      ref={mediaStream ? addMediaStream : null}
    >
      <track default kind="captions" />
    </video>
  );
};
