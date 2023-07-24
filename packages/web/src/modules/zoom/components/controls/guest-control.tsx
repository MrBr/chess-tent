import React, { useCallback } from 'react';

import { ui } from '@application';
import { Components } from '@types';

import { ZoomContextType, useZoomContext } from '../../context';
import { isZoomConnectionInProgress } from '../../services';

const { Button, Form } = ui;

interface ZoomGuestData {
  password: string;
}

const ZoomGuestControl: Components['ZoomGuestControl'] = () => {
  const zoomContext: ZoomContextType = useZoomContext();

  const onSubmit = useCallback(
    ({ password }: ZoomGuestData) => {
      zoomContext.updateContext({ password });
    },
    [zoomContext],
  );

  if (isZoomConnectionInProgress(zoomContext.connectionStatus)) {
    return <></>;
  }

  return (
    <Form
      initialValues={{ password: '' }}
      onSubmit={onSubmit}
      className="text-center"
    >
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

export default ZoomGuestControl;
