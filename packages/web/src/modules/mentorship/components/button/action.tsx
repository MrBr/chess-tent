import React, { useCallback, useEffect } from 'react';
import { hooks, requests, state, ui } from '@application';
import { Components } from '@types';

const { useApi, useDispatch } = hooks;
const {
  actions: { updateEntities },
} = state;
const { Button } = ui;

const MentorshipActionButton = (({
  size,
  mentorship,
  approve,
  className,
  text,
}) => {
  const dispatch = useDispatch();
  const { fetch, response, loading, reset } = useApi(
    requests.mentorshipResolve,
  );
  const resolveMentorshipHandle = useCallback(() => {
    fetch({
      studentId: mentorship.student.id,
      coachId: mentorship.coach.id,
      approved: !!approve,
    });
  }, [approve, fetch, mentorship.coach.id, mentorship.student.id]);
  useEffect(() => {
    if (!response) {
      return;
    }
    reset();
    dispatch(
      updateEntities({
        ...mentorship,
        approved: approve,
      }),
    );
  }, [response, dispatch, mentorship, reset, approve]);
  return (
    <Button
      size={size}
      onClick={resolveMentorshipHandle}
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
