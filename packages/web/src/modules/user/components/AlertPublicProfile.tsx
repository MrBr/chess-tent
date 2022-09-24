import React from 'react';
import { hooks, ui } from '@application';
import { COACH_REQUIRED_STATE } from '@chess-tent/types';

const { Alert } = ui;
const { useActiveUserRecord } = hooks;

const AlertPublicProfile = () => {
  const { value: user } = useActiveUserRecord();
  if (!user.coach) {
    return null;
  }
  const missingState = COACH_REQUIRED_STATE.filter(key => !user.state[key]);
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
