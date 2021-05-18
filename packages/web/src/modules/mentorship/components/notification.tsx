import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { hooks, ui, components } from '@application';

const { ToastHeader, ToastBody, Text, Dropdown } = ui;
const { Link } = components;
const { useHistory } = hooks;

export const Toast: NotificationComponent<
  Notification & {
    state: { text: string };
  }
> = ({ notification }) => {
  const { text } = notification.state;

  return (
    <>
      <ToastHeader>
        <Text weight={700} className="mb-0">
          Mentorship request
        </Text>
      </ToastHeader>
      <ToastBody>
        <Link to={'/me/students'}>
          <Text>{text}</Text>
        </Link>
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
