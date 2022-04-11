import React, { useCallback } from 'react';

export interface RTCVideoProps {
  mediaStream?: MediaStream;
  muted?: boolean;
}

export const RTCVideo: React.FC<RTCVideoProps> = ({ mediaStream, muted }) => {
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
      muted={muted}
      ref={mediaStream ? addMediaStream : null}
    >
      <track default kind="captions" />
    </video>
  );
};
