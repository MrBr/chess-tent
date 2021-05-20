import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { hooks, ui } from '@application';

const { ToastHeader, ToastBody, Text, Dropdown, Button } = ui;
const { useHistory } = hooks;

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
    <Dropdown.Item onClick={() => history.push('/me/students')}>
      <Text weight={700} fontSize="small">
        Mentorship request
      </Text>
      <Text fontSize="extra-small">{text}</Text>
    </Dropdown.Item>
  );
};
