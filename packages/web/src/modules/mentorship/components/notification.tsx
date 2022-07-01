import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { components, hooks, ui } from '@application';

const { ToastHeader, ToastBody, Text, Button } = ui;
const { useHistory } = hooks;
const { NotificationStandItem } = components;

export const Toast: NotificationComponent<
  Notification & {
    state: { text: string };
  }
> = ({ notification }) => {
  const history = useHistory();
  const { text } = notification.state;

  return (
    <>
      <ToastHeader>
        <Text weight={700} className="mb-0">
          Mentorship request
        </Text>
      </ToastHeader>
      <ToastBody>
        <Text>{text}</Text>
        <Button
          size="extra-small"
          variant="secondary"
          onClick={() => history.push('/me/students')}
        >
          See more
        </Button>
      </ToastBody>
    </>
  );
};

export const DropdownItem: NotificationComponent<
  Notification & {
    state: { text: string };
  }
> = ({ notification }) => {
  const history = useHistory();
  const { text } = notification.state;
  return (
    <NotificationStandItem onClick={() => history.push('/me/students')}>
      <Text weight={500} fontSize="small">
        Mentorship request
      </Text>
      <Text fontSize="extra-small">{text}</Text>
    </NotificationStandItem>
  );
};
