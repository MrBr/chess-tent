import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components } from '@types';

import { ZoomContextType, useZoomContext } from '../../context';

const { Button, Form } = ui;

interface ZoomGuestData {
  meetingNumber: string;
  password: string;
}

const ZoomGuestControl: Components['ZoomGuestControl'] = () => {
  const zoomContext: ZoomContextType = useZoomContext();

  const onSubmit = useCallback(
    ({ meetingNumber, password }: ZoomGuestData) => {
      zoomContext.updateContext((prevState: ZoomContextType) => ({
        ...prevState,
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      }));
    },
    [zoomContext],
  );

  return (
    <>
      {!zoomContext.userSignature && (
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

export default ZoomGuestControl;
