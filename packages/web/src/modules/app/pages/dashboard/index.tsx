import React from 'react';
import { hooks } from '@application';
import { User } from '@chess-tent/models';
import CoachDashboard from './coach';
import StudentDashboard from './student';

const { useActiveUserRecord } = hooks;

export default () => {
  const [activeUser] = useActiveUserRecord() as [User, never, never, never];
  return activeUser.coach ? (
    <CoachDashboard user={activeUser} />
  ) : (
    <StudentDashboard user={activeUser} />
  );
};
