import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components } from '@types';

import { ZoomContextType } from '../../context';
import { authorizeZoom } from '../../services';

const { Button, Form } = ui;

interface ZoomHostData {
  meetingNumber: string;
  password: string;
}

const ZoomHostControl: Components['ZoomHostControl'] = ({
  isAuthorized,
  redirectUri,
  onJoin,
}) => {
  const onSubmit = useCallback(
    ({ meetingNumber, password }: ZoomHostData) => {
      onJoin((prevState: ZoomContextType) => ({
        ...prevState,
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      }));
    },
    [onJoin],
  );

  return (
    <>
      {!isAuthorized ? (
        <Button onClick={() => authorizeZoom(redirectUri)}>
          Authorize Zoom
        </Button>
      ) : (
        <Form
          initialValues={{ meetingNumber: '', password: '' }}
          onSubmit={onSubmit}
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
            type="text"
            name="password"
            placeholder="Meeting password (if any)"
            className="mb-3"
          />
          <Button size="small" type="submit">
            Join
          </Button>
        </Form>
      )}
    </>
  );
};

export default ZoomHostControl;
