import React from 'react';
import { hooks } from '@application';
import CoachDashboard from './coach';
import StudentDashboard from './student';

const { useActiveUserRecord } = hooks;

export default () => {
  const [activeUser] = useActiveUserRecord();
  return activeUser.coach ? (
    <CoachDashboard user={activeUser} />
  ) : (
    <StudentDashboard user={activeUser} />
  );
};
