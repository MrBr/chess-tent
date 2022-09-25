import React, { useEffect, useRef } from 'react';

export interface RTCAudioProps {
  mediaStream?: MediaStream;
  muted?: boolean;
}

const RTCAudio = (props: RTCAudioProps) => {
  const { mediaStream, muted } = props;
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (!mediaStream) {
      audioRef.current.srcObject = null;
      return;
    }
    audioRef.current.srcObject = mediaStream;
  }, [audioRef, mediaStream]);

  if (!mediaStream) {
    return null;
  }

  return <audio autoPlay muted={muted} ref={audioRef} />;
};

export default RTCAudio;
