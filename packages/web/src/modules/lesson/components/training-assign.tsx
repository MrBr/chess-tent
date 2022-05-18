import React from 'react';
import { hooks, ui } from '@application';

import { useCreateNewTraining } from '../hooks/activity';
import ActivityForm, { ActivityData } from './activity-form';

const { Headline3, Headline4, Button, Text, Modal, Container, Row, Col } = ui;
const { useActiveUserRecord } = hooks;

interface TrainingAssignProps {
  close: () => void;
}

const TrainingAssign = ({ close }: TrainingAssignProps) => {
  const { value: user } = useActiveUserRecord();
  const createNewTraining = useCreateNewTraining(user);

  const createTraining = (data: ActivityData) => {
    createNewTraining(data);
    close();
  };

  return (
    <Modal show close={close}>
      <Modal.Header>
        <Container>
          <Headline3>Create Training</Headline3>
          <Text>Make a virtual room for your students</Text>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Headline4 className="mt-0">Details</Headline4>
            </Col>
          </Row>
          <ActivityForm
            onSubmit={createTraining}
            submitButton={
              <Row className="mt-4">
                <Col>
                  <Button type="submit" size="small">
                    Create training
                  </Button>
                </Col>
              </Row>
            }
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default TrainingAssign;
