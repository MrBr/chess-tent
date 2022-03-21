import React, { useCallback, useEffect } from 'react';
import { hooks, requests, ui } from '@application';
import { Components } from '@types';
import { Mentorship } from '@chess-tent/models';

const { useActiveUserRecord, useCoaches, useApi } = hooks;
const { Button } = ui;

export default (({ user, className }) => {
  const { value: me } = useActiveUserRecord();
  const { value: coaches, update: setCoaches } = useCoaches(me);
  const {
    fetch: requestMentorship,
    response,
    loading,
    reset,
  } = useApi(requests.mentorshipRequest);
  const requestMentorshipHandle = useCallback(() => {
    requestMentorship({ coachId: user.id, studentId: me.id });
  }, [requestMentorship, user.id, me.id]);

  useEffect(() => {
    if (!response) {
      return;
    }
    reset();
    setCoaches([...(coaches || []), response.data as unknown as Mentorship]);
  }, [coaches, reset, response, setCoaches]);

  if (!user.coach || user.id === me.id) {
    // Prevent user from coaching himself
    return null;
  }

  const coach = coaches?.find(mentor => mentor.coach.id === user.id);

  return !coach ? (
    <Button
      size="extra-small"
      onClick={requestMentorshipHandle}
      disabled={loading}
      className={className}
    >
      Request mentorship
    </Button>
  ) : !coach.approved ? (
    <Button size="extra-small" variant="regular" className={className}>
      Mentorship requested
    </Button>
  ) : (
    <Button size="extra-small" variant="secondary" className={className}>
      Your mentor
    </Button>
  );
}) as Components['MentorshipButton'];
