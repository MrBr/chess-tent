import React, { useEffect, useRef, RefCallback } from 'react';
import styled from '@chess-tent/styled-props';
import useDraggable from '../hooks/useDraggable';

export interface RTCVideoProps {
  mediaStream?: MediaStream;
  muted?: boolean;
  className?: string;
  containerRef?: RefCallback<HTMLDivElement>;
  draggable?: boolean;
}

const RTCVideo = styled<RTCVideoProps>(props => {
  const { mediaStream, muted, className, draggable } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useDraggable(!!draggable);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (!mediaStream) {
      videoRef.current.srcObject = null;
      return;
    }
    videoRef.current.srcObject = mediaStream;
  }, [videoRef, mediaStream]);

  if (!mediaStream) {
    return null;
  }

  return (
    <div className={className} ref={containerRef}>
      <video autoPlay muted={muted} ref={videoRef} playsInline />
    </div>
  );
}).css`
  width: 115px;
  height: 115px;
  max-width: 115px;
  border-radius: 10px;
  overflow: hidden;
  position: absolute;

  video {
    width: 200px;
    height: 200px;
    background-color: var(--grey-700-color);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    zoom: 1.3;
  }
`;

RTCVideo.defaultProps = {
  draggable: true,
};

export default RTCVideo;
