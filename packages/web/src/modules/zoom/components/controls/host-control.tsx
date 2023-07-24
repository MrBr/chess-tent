import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components } from '@types';

import { ZoomContextType, useZoomContext } from '../../context';
import { authorizeZoom } from '../../services';

const { Button, Form } = ui;

interface ZoomHostData {
  meetingNumber: string;
  password: string;
}

const ZoomHostControl: Components['ZoomHostControl'] = () => {
  const zoomContext: ZoomContextType = useZoomContext();

  const onSubmit = useCallback(
    ({ meetingNumber, password }: ZoomHostData) => {
      zoomContext.updateContext((prevState: ZoomContextType) => ({
        ...prevState,
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      }));
    },
    [zoomContext],
  );

  if (zoomContext.isOnCall) {
    return <></>;
  }

  if (!zoomContext.password && !zoomContext.authCode) {
    return (
      <Button onClick={() => authorizeZoom(zoomContext.redirectUri)}>
        Authorize Zoom
      </Button>
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
