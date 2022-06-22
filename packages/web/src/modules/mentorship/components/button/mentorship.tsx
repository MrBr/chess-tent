import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

const { useActiveUserRecord, useCoaches } = hooks;
const { Button } = ui;

export default (({ user, className, textual }) => {
  const { value: me } = useActiveUserRecord();
  const {
    value: coaches,
    requestMentorship,
    meta: { loading },
  } = useCoaches(me);

  if (!user.coach || user.id === me.id) {
    // Prevent user from coaching himself
    return null;
  }

  const coach = coaches?.find(mentor => mentor.coach.id === user.id);

  return (
    <Button
      size="extra-small"
      onClick={() => !coach && requestMentorship(me, user)}
      disabled={loading}
      className={className}
      variant={textual ? 'text' : coach ? 'primary' : 'secondary'}
    >
      {!coach
        ? 'Request mentorship'
        : !coach.approved
        ? 'Mentorship requested'
        : 'Your mentor'}
    </Button>
  );
}) as Components['MentorshipButton'];
