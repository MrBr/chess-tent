import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components } from '@types';

import { ZoomContextType } from '../../context';

const { Button, Form } = ui;

interface ZoomGuestData {
  meetingNumber: string;
  password: string;
}

const ZoomGuestControl: Components['ZoomGuestControl'] = ({ onJoin }) => {
  const onSubmit = useCallback(
    ({ meetingNumber, password }: ZoomGuestData) => {
      onJoin((prevState: ZoomContextType) => ({
        ...prevState,
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      }));
    },
    [onJoin],
  );

  return (
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
  );
};

export default ZoomGuestControl;
