import React, { useCallback } from 'react';
import { hooks, ui } from '@application';

import { useUserScheduledTrainings, useUserTrainings } from '../hooks/activity';
import { createLessonActivity, createNewLesson } from '../service';
import ActivityForm, { ActivityData } from './activity-form';

const { Headline3, Headline4, Button, Text, Modal, Container, Row, Col } = ui;
const { useActiveUserRecord, useHistory } = hooks;

const TrainingAssign = ({ close }: { close: () => void }) => {
  const { value: user } = useActiveUserRecord();
  const userTrainings = useUserTrainings(user);
  const userScheduledTrainings = useUserScheduledTrainings(user);
  const history = useHistory();

  const createTraining = useCallback(
    async (data: ActivityData) => {
      const { new: newTraining } = data.date
        ? userScheduledTrainings
        : userTrainings;
      const lesson = createNewLesson(user, []);
      const training = createLessonActivity(
        lesson,
        user,
        { title: data.title, date: data.date, weekly: data.weekly },
        { activeStepId: 'analysis-step' },
        data.students,
      );
      await newTraining(training);
      history.push(`/activity/${training.id}`);
      close();
    },
    [userScheduledTrainings, userTrainings, user, history, close],
  );

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
              <Button type="submit" size="small">
                Create training
              </Button>
            }
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default TrainingAssign;
