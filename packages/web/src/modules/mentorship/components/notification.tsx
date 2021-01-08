import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { hooks, ui } from '@application';

const { ToastHeader, ToastBody, Button, Text, Dropdown } = ui;
const { useHistory } = hooks;

export const Toast: NotificationComponent<
  Notification & {
    state: { text: string };
  }
> = ({ notification }) => {
  return (
    <>
      <ToastHeader>
        <Text weight={700} className="mb-0">
          Mentorship request
        </Text>
      </ToastHeader>
      <ToastBody>
        <Text>{notification.state.text}</Text>
        <Button size="extra-small" className="mr-3">
          Accept
        </Button>
        <Button size="extra-small" variant="secondary">
          Preview
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
  return (
    <Dropdown.Item onClick={() => history.push('/me/students')}>
      <Text weight={700} fontSize="small">
        Mentorship request
      </Text>
      <Text fontSize="extra-small">{notification.state.text}</Text>
    </Dropdown.Item>
  );
};
