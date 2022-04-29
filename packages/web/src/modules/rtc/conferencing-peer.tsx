import React, { memo } from 'react';
import type { Components } from '@types';

import { RTCVideo } from './components/rtc-video';
import { usePeerConnection } from './hooks/usePeerConnection';

export const ConferencingPeer: Components['ConferencingPeer'] = memo(
  ({ fromUserId, toUserId, room }) => {
    const remoteMediaStream = usePeerConnection(room, fromUserId, toUserId);

    return (
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <RTCVideo mediaStream={remoteMediaStream} />
      </div>
    );
  },
);
