import React, { useEffect, useCallback } from 'react';
import { Components } from '@types';
import { ui } from '@application';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { ZoomContextType, useZoomContext } from '../context';

const { Container } = ui;

interface ZoomConnectionChange {
  state: string;
  reason?: string;
  errorCode?: number;
}

const ZoomActivityView: Components['ZoomActivityView'] = () => {
  const {
    resetContext,
    meetingNumber,
    userSignature,
    username,
    password,
    hostUserZakToken,
  }: ZoomContextType = useZoomContext();

  const connectionChange = useCallback(
    (event: ZoomConnectionChange) => {
      if (event.state === 'Closed' || event.state === 'Fail') {
        resetContext();
      }
    },
    [resetContext],
  );

  useEffect(() => {
    if (!password || !userSignature || !meetingNumber) {
      return;
    }

    const client = ZoomMtgEmbedded.createClient();

    const meetingSDKElement =
      document.getElementById('meetingSDKElement') || undefined;

    const sdkKey = process.env.REACT_APP_ZOOM_CLIENT_ID;

    client
      .init({
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
      })
      .then(() => {
        client.join({
          sdkKey: sdkKey,
          signature: userSignature,
          meetingNumber: meetingNumber,
          userName: username,
          password: password,
          zak: hostUserZakToken || '',
        });
      });

    client.on('connection-change', connectionChange);
  }, [
    userSignature,
    meetingNumber,
    username,
    password,
    hostUserZakToken,
    connectionChange,
  ]);

  return <Container id="meetingSDKElement"></Container>;
};

export default ZoomActivityView;
