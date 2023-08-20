import React, { useEffect, useCallback } from 'react';
import { Components, ZoomContext as ZoomContextType } from '@types';
import { ui } from '@application';
import { ZoomConnectionStatus } from '@chess-tent/models';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { useZoomContext } from '../context';

const { Container } = ui;

interface ZoomConnectionChange {
  state: string;
  reason?: string;
  errorCode?: number;
}

const MEETING_NOT_STARTED_ERROR_CODE = 3008;

const ZoomActivityView: Components['ZoomActivityView'] = () => {
  const {
    resetContext,
    meetingNumber,
    userSignature,
    username,
    password,
    hostUserZakToken,
    updateContext,
    zoomSDKElementRef,
  }: ZoomContextType = useZoomContext();
  const connectionChange = useCallback(
    (event: ZoomConnectionChange) => {
      switch (event.state) {
        case 'Connected':
          updateContext({ connectionStatus: ZoomConnectionStatus.CONNECTED });
          break;
        case 'Closed':
          resetContext();
          break;
        case 'Fail':
          if (event?.errorCode !== MEETING_NOT_STARTED_ERROR_CODE) {
            resetContext();
          }
          break;
      }
    },
    [resetContext, updateContext],
  );

  useEffect(() => {
    if (!zoomSDKElementRef) {
      return;
    }

    if (!password || !userSignature || !meetingNumber) {
      return;
    }

    const client = ZoomMtgEmbedded.createClient();

    const sdkKey = process.env.REACT_APP_ZOOM_CLIENT_ID;

    client
      .init({
        zoomAppRoot: zoomSDKElementRef.current || undefined,
        language: 'en-US',
      })
      .then(() => {
        updateContext({ connectionStatus: ZoomConnectionStatus.CONNECTING });

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
    zoomSDKElementRef,
    updateContext,
    connectionChange,
  ]);

  return <Container ref={zoomSDKElementRef}></Container>;
};

export default ZoomActivityView;
