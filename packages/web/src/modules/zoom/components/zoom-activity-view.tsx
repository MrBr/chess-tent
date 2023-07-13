import React, { useEffect } from 'react';
import { Components } from '@types';
import { ui } from '@application';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { ZoomContextType, useZoomContext } from '../context';

const { Container } = ui;

const ZoomActivityView: Components['ZoomActivityView'] = () => {
  const zoomContext: ZoomContextType = useZoomContext();

  useEffect(() => {
    const client = ZoomMtgEmbedded.createClient();
    const meetingSDKElement =
      document.getElementById('meetingSDKElement') || undefined;

    const sdkKey = process.env.REACT_APP_ZOOM_CLIENT_ID;

    console.log({ zoomContext });

    client
      .init({
        debug: true,
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
  }, [zoomContext]);

  return <Container id="meetingSDKElement"></Container>;
};

export default ZoomActivityView;
