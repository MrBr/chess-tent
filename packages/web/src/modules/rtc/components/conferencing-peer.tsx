import React, { memo } from 'react';
import type { Components } from '@types';
import { isMobile } from 'react-device-detect';

import RTCVideo from './rtc-video';
import RTCAudio from './rtc-audio';
import { usePeerConnection } from '../hooks/usePeerConnection';

const ConferencingPeer: Components['ConferencingPeer'] = memo(
  ({ fromUserId, toUserId, room, polite }) => {
    const remoteMediaStream = usePeerConnection(
      room,
      fromUserId,
      toUserId,
      polite,
    );

    if (isMobile) {
      return <RTCAudio mediaStream={remoteMediaStream} />;
    }

    return <RTCVideo mediaStream={remoteMediaStream} />;
  },
);

export default ConferencingPeer;
