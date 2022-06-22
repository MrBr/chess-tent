import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

const { useMentorship } = hooks;
const { Button } = ui;

const MentorshipActionButton = (({
  size,
  mentorship,
  approve,
  className,
  text,
}) => {
  const { update, loading } = useMentorship(mentorship);
  return (
    <Button
      size={size}
      onClick={() => update(!mentorship.approved)}
      disabled={loading || approve === mentorship.approved}
      variant={approve ? 'primary' : 'secondary'}
      className={className}
    >
      {text || (approve ? 'Approve' : 'Decline')}
    </Button>
  );
}) as Components['MentorshipAction'];

MentorshipActionButton.defaultProps = {
  approve: true,
  size: 'extra-small',
};

export default MentorshipActionButton;
