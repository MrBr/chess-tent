import React from 'react';
import { ApiStatus } from '@types';
import { ui } from '@application';

const { Badge } = ui;

const getStatusText = (status: ApiStatus) => {
  switch (status) {
    case ApiStatus.DIRTY:
      return 'Have unsaved changes';
    case ApiStatus.ERROR:
      return 'Something went wrong, not saved';
    case ApiStatus.LOADING:
      return 'Initialising';
    case ApiStatus.SAVING:
      return 'Saving';
    case ApiStatus.INITIAL:
      return 'Ready';
    case ApiStatus.SAVED:
    default:
      return 'Saved';
  }
};

const Status = ({ status }: { status: ApiStatus }) => (
  <Badge>{getStatusText(status)}</Badge>
);

export default Status;
