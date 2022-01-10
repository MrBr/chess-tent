import React, { useCallback } from 'react';

export interface RTCVideProps {
  mediaStream?: MediaStream;
}

export const RTCVideo: React.FC<RTCVideProps> = ({ mediaStream }) => {
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
      style={{ width: '480px', backgroundColor: 'black' }}
      autoPlay
      ref={mediaStream ? addMediaStream : null}
    >
      <track default kind="captions" />
    </video>
  );
};
