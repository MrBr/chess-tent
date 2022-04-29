import React, { useEffect, useRef } from 'react';
import styled from '@chess-tent/styled-props';

import useDraggable from '../hooks/useDraggable';

export interface RTCVideoProps {
  mediaStream?: MediaStream;
  muted?: boolean;
  className?: string;
}

export const RTCVideo = styled<RTCVideoProps>(props => {
  const { mediaStream, muted, className } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useDraggable();

  useEffect(() => {
    if (!mediaStream || !videoRef.current) {
      return;
    }
    videoRef.current.srcObject = mediaStream;
  }, [videoRef, mediaStream]);

  return (
    <div className={className} ref={containerRef}>
      <video autoPlay muted={muted} ref={videoRef}>
        <track default kind="captions" />
      </video>
    </div>
  );
}).css`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  max-width: 80px;
  position: absolute;

  video {
    width: 144px;
    height: 108px;
    background-color: black;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    zoom: 1.2;
  }
`;
