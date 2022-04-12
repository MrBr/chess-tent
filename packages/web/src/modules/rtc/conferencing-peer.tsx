import React, { memo } from 'react';
import type { Components } from '@types';

import { RTCVideo } from './components/rtc-video';
import { usePeerConnection } from './hook';

export const ConferencingPeer: Components['ConferencingPeer'] = memo(
  ({ activityId, fromUserId, toUserId }) => {
    const remoteMediaStream = usePeerConnection(
      activityId,
      fromUserId,
      toUserId,
    );

    return (
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <RTCVideo mediaStream={remoteMediaStream} />
      </div>
    );
  },
);
