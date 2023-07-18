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
  const zoomContext: ZoomContextType = useZoomContext();

  const connectionChange = useCallback(
    (event: ZoomConnectionChange) => {
      if (event.state === 'Closed' || event.state === 'Fail') {
        zoomContext.resetContext();
      }
    },
    [zoomContext],
  );

  useEffect(() => {
    if (zoomContext.meetingNumber === '' || zoomContext.userSignature === '') {
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
          signature: zoomContext.userSignature,
          meetingNumber: zoomContext.meetingNumber,
          userName: zoomContext.username,
          password: zoomContext.password,
          zak: zoomContext.hostUserZakToken || '',
        });
      });

    client.on('connection-change', connectionChange);
  }, [zoomContext, connectionChange]);

  return <Container id="meetingSDKElement"></Container>;
};

export default ZoomActivityView;
