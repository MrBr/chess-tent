import React, { memo } from 'react';
import type { Components } from '@types';

import RTCVideo from './rtc-video';
import { usePeerConnection } from '../hooks/usePeerConnection';

const ConferencingPeer: Components['ConferencingPeer'] = memo(
  ({ fromUserId, toUserId, room }) => {
    const remoteMediaStream = usePeerConnection(room, fromUserId, toUserId);

    return <RTCVideo mediaStream={remoteMediaStream} />;
  },
);

export default ConferencingPeer;
