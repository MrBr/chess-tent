import React, { FC } from 'react';

import type { ConferencingProps } from '@types';

import RTCMesh from './RTCMesh';

export const Conferencing: FC<ConferencingProps> = ({ activityId }) => {
  return (
    <RTCMesh
      URL="ws://localhost:3007/api/socket.io/?EIO=3&transport=websocket"
      activityId={activityId}
    />
  );
};
