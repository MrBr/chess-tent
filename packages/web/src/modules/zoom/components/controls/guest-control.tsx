import React, { useCallback } from 'react';

import { ui } from '@application';

import { ZoomContextType } from '../../context';

const { Button, Form } = ui;

const GuestControl = ({
  setZoomContextState,
}: {
  setZoomContextState: Function;
}) => {
  const onSubmit = useCallback(
    ({
      meetingNumber,
      password,
    }: {
      meetingNumber: string;
      password: string;
    }) => {
      setZoomContextState((prevState: ZoomContextType) => ({
        ...prevState,
        meetingNumber: meetingNumber.replaceAll(' ', ''),
        password,
      }));
    },
    [setZoomContextState],
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

export default GuestControl;
