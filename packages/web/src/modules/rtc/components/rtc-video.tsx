import React, { useEffect, useRef } from 'react';

export interface RTCVideoProps {
  mediaStream?: MediaStream;
  muted?: boolean;
}

export const RTCVideo: React.FC<RTCVideoProps> = ({ mediaStream, muted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!mediaStream || !videoRef.current) {
      return;
    }
    videoRef.current.srcObject = mediaStream;
  }, [videoRef, mediaStream]);

  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        overflow: 'hidden',
        maxWidth: 80,
        position: 'relative',
      }}
    >
      <video
        style={{
          width: 144,
          height: 108,
          backgroundColor: 'black',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          zoom: 1.2,
        }}
        autoPlay
        muted={muted}
        ref={videoRef}
      >
        <track default kind="captions" />
      </video>
    </div>
  );
};
