import React from 'react';
import { hooks, ui } from '@application';
import CoachDashboard from './coach';
import StudentDashboard from './student';

const { useActiveUserRecord, useIsMobile } = hooks;
const { Modal, Headline4, Text } = ui;

const Dashboard = () => {
  const { value: activeUser } = useActiveUserRecord();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Modal>
        <Modal.Header>
          <Headline4>Please use on desktop or tablet</Headline4>
        </Modal.Header>
        <Modal.Body>
          <Text>
            Mobile version is currently unavailable, it should be available
            soon. <br />
            Chess Tent is currently in the Beta phase and the mobile version is
            being developed as you read.
          </Text>
        </Modal.Body>
      </Modal>
    );
  }

  return activeUser.coach ? (
    <CoachDashboard user={activeUser} />
  ) : (
    <StudentDashboard user={activeUser} />
  );
};

export default Dashboard;
