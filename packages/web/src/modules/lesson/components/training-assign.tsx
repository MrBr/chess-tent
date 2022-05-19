import React, { useRef } from 'react';
import { hooks, ui } from '@application';
import { FormikProps } from '@types';
import { Lesson } from '@chess-tent/models';

import { useCreateNewTraining } from '../hooks/activity';
import ActivityForm, { ActivityData } from './activity-form';

const { Headline5, Button, Text, Modal, Container, Row, Col, Badge } = ui;
const { useActiveUserRecord } = hooks;

interface TrainingAssignProps {
  close: () => void;
  lesson?: Lesson;
}

const TrainingAssign = ({ close, lesson }: TrainingAssignProps) => {
  const { value: user } = useActiveUserRecord();
  const createNewTraining = useCreateNewTraining(user);
  const activityFormRef = useRef<FormikProps<ActivityData>>(null);

  const createTraining = (redirect?: boolean) => {
    if (!activityFormRef.current) {
      return;
    }
    const data = activityFormRef.current.values;
    createNewTraining(data, lesson?.state.chapters || [], { redirect });
    close();
  };

  return (
    <Modal show close={close}>
      <Modal.Header>
        <Container>
          <Headline5>Create Training</Headline5>
          <Text className="mb-0" fontSize="extra-small">
            Make a virtual room for your students
          </Text>
        </Container>
      </Modal.Header>
      <Modal.Body>
        <Container className="pb-3">
          {lesson && (
            <Row className="mb-2">
              <Col>
                <Badge>
                  You're creating training with: {lesson?.state.title}
                </Badge>
              </Col>
            </Row>
          )}
          <Row className="mb-3">
            <Col>
              <Text className="m-0" weight={400}>
                Details
              </Text>
            </Col>
          </Row>
          <ActivityForm formRef={activityFormRef} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Col className="col-auto">
          <Button
            size="small"
            variant="ghost"
            onClick={() => createTraining(false)}
          >
            Create and close
          </Button>
        </Col>
        <Col className="col-auto">
          <Button
            size="small"
            variant="tertiary"
            onClick={() => createTraining(true)}
          >
            Create training
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default TrainingAssign;
