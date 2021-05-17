import React, { useEffect } from 'react';
import { NotificationComponent } from '@types';
import { Mentorship, Notification, TYPE_MENTORSHIP } from '@chess-tent/models';
import { hooks, ui, components, state } from '@application';

const { ToastHeader, ToastBody, Button, Text, Dropdown } = ui;
const { MessageButton, MentorshipAction } = components;
const { useHistory, useRecord } = hooks;

export const Toast: NotificationComponent<
  Notification & {
    state: { text: string; mentorship: Mentorship };
  }
> = ({ notification }) => {
  const { text, mentorship: newMentorship } = notification.state;
  const history = useHistory();
  const [mentorship, updateMentorship] = useRecord<Mentorship>(
    `${TYPE_MENTORSHIP}-${newMentorship.coach.id}-${newMentorship.student.id}`,
    TYPE_MENTORSHIP,
  );
  useEffect(() => {
    updateMentorship(newMentorship);
  }, [newMentorship, updateMentorship]);

  if (!mentorship) {
    return null;
  }

  return (
    <>
      <ToastHeader>
        <Text weight={700} className="mb-0">
          Mentorship request
        </Text>
      </ToastHeader>
      <ToastBody>
        <Text>{text}</Text>
        <MessageButton
          user={mentorship.student}
          className="mr-4"
          size="extra-small"
          variant="regular"
        />
        {mentorship.approved ? (
          <Text inline className="mr-4">
            Accepted
          </Text>
        ) : (
          <MentorshipAction
            mentorship={mentorship}
            text="Accept"
            className="mr-4"
          />
        )}
        <Button
          size="extra-small"
          variant="secondary"
          onClick={() => history.push(`/user/${mentorship.student.id}`)}
        >
          Preview
        </Button>
      </ToastBody>
    </>
  );
};

export const DropdownItem: NotificationComponent<
  Notification & {
    state: { text: string; mentorship: Mentorship };
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
