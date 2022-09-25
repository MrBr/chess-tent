import React from 'react';
import { hooks, ui } from '@application';
import { COACH_REQUIRED_STATE } from '@chess-tent/types';
import { User } from '@chess-tent/models';

const { Alert } = ui;
const { useActiveUserRecord } = hooks;

interface AlertPublicProfileProps {
  user: User;
}

const AlertPublicProfile = ({ user }: AlertPublicProfileProps) => {
  const { value: activeUser } = useActiveUserRecord();

  if (user.id !== activeUser.id || !activeUser.coach) {
    return null;
  }

  const missingState = COACH_REQUIRED_STATE.filter(
    key => !activeUser.state[key],
  );

  if (missingState.length === 0) {
    return null;
  }

  return (
    <Alert variant="danger">
      Your profile isn't public, missing some details ({missingState.join(', ')}
      )
    </Alert>
  );
};

export default AlertPublicProfile;
