import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { ui } from '@application';

const { ToastHeader, ToastBody, Button, Text, Container } = ui;

export const Toast: NotificationComponent<Notification & {
  state: { text: string };
}> = ({ notification }) => {
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

export const Dropdown: NotificationComponent<Notification & {
  state: { text: string };
}> = ({ notification }) => {
  return (
    <Container>
      <Text weight={700}>Mentorship request</Text>
      <Text>{notification.state.text}</Text>
    </Container>
  );
};
