import React, { FC, memo } from 'react';

import type { ConferencingProps } from '@types';

import RTCMesh from './RTCMesh';

export const Conferencing: FC<ConferencingProps> = memo(({ activityId }) => {
  return (
    <RTCMesh
      activityId={activityId}
      webSocketUrl="ws://localhost:3007/api/socket.io/?EIO=3&transport=websocket"
    />
  );
});
