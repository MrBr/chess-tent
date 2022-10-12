import React from 'react';
import { NotificationComponent } from '@types';
import { Notification } from '@chess-tent/models';
import { components, hooks, ui } from '@application';

const { ToastHeader, ToastBody, Text, Button } = ui;
const { useHistory } = hooks;
const { NotificationStandItem } = components;

const getNotificationText = (activityTitle: string) => {
  return `${activityTitle} has been assigned to you. You can start with practice.`;
};

export const Toast: NotificationComponent<
  Notification & {
    state: { activityId: string; activityTitle: string };
  }
> = ({ notification }) => {
  const history = useHistory();
  const { activityId, activityTitle } = notification.state;

  return (
    <>
      <ToastHeader>
        <Text weight={700} className="mb-0">
          New Activity
        </Text>
      </ToastHeader>
      <ToastBody>
        <Text>{getNotificationText(activityTitle)}</Text>
        <Button
          size="extra-small"
          variant="secondary"
          onClick={() => history.push(`/activity/${activityId}`)}
        >
          Start
        </Button>
      </ToastBody>
    </>
  );
};

export const DropdownItem: NotificationComponent<
  Notification & {
    state: { activityId: string; activityTitle: string };
  }
> = ({ notification }) => {
  const history = useHistory();
  const { activityId, activityTitle } = notification.state;
  return (
    <NotificationStandItem
      title="New Activity"
      subtitle={getNotificationText(activityTitle)}
      onClick={() => history.push(`/activity/${activityId}`)}
    />
  );
};
