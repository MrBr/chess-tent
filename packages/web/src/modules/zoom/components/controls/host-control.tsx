import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components, ZoomContext as ZoomContextType } from '@types';

import { useZoomContext } from '../../context';
import { authorizeZoom, isZoomConnectionInProgress } from '../../services';

const { Button, Form, Spinner } = ui;

interface ZoomHostData {
  meetingNumber: string;
  password: string;
}

const ZoomHostControl: Components['ZoomHostControl'] = () => {
  const zoomContext: ZoomContextType = useZoomContext();

  const onSubmit = useCallback(
    ({ meetingNumber, password }: ZoomHostData) => {
      zoomContext.updateContext({
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      });
    },
    [zoomContext],
  );

  if (isZoomConnectionInProgress(zoomContext.connectionStatus)) {
    return <></>;
  }

  if (
    !zoomContext.password &&
    !zoomContext.authCode &&
    !zoomContext.hostUserZakToken
  ) {
    return zoomContext.zakTokenRequested ? (
      <Button onClick={() => authorizeZoom(zoomContext.redirectUri)}>
        Authorize Zoom
      </Button>
    ) : (
      <Spinner animation="border" className="align-self-center" />
    );
  }

  return (
    <Form
      initialValues={{ meetingNumber: '', password: '' }}
      onSubmit={onSubmit}
      className="text-center"
    >
      <Form.Input
        size="small"
        type="text"
        name="meetingNumber"
        placeholder="Meeting number"
        className="mb-3"
      />
      <Form.Input
        size="small"
        type="password"
        name="password"
        placeholder="Meeting password (if any)"
        className="mb-3"
      />
      <Button size="small" type="submit">
        Join
      </Button>
    </Form>
  );
};

export default ZoomHostControl;
