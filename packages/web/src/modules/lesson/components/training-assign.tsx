import React, { useCallback, useMemo } from 'react';
import { components, hooks, ui } from '@application';
import * as yup from 'yup';
import {
  useUserScheduledTrainings,
  useUserTrainings,
} from '../hooks/training-hooks';
import { createLessonActivity, createNewLesson } from '../service';

const {
  Label,
  Headline3,
  Headline4,
  FormGroup,
  Button,
  Form,
  Text,
  Modal,
  Container,
  Row,
  Col,
} = ui;
const { useActiveUserRecord, useStudents, useHistory } = hooks;
const { UserAvatar } = components;

const TrainingSchema = yup.object().shape({
  user: yup.string().required(),
});

const TrainingAssign = ({ close }: { close: () => void }) => {
  const { value: user } = useActiveUserRecord();
  const { value: mentorship } = useStudents(user);
  const userTrainings = useUserTrainings(user);
  const userScheduledTrainings = useUserScheduledTrainings(user);
  const history = useHistory();

  const students = useMemo(
    () => mentorship?.map(({ student }) => student),
    [mentorship],
  );

  const createTraining = useCallback(
    async (data, helpers) => {
      const { new: newTraining } = data.date
        ? userScheduledTrainings
        : userTrainings;
      const lesson = createNewLesson(user, []);
      const training = createLessonActivity(
        lesson,
        user,
        {},
        { activeStepId: 'analysis-step' },
        [data.user],
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
          <Form
            initialValues={{ user: '' }}
            validationSchema={TrainingSchema}
            onSubmit={createTraining}
          >
            <FormGroup>
              <Label>Training name</Label>
              <Form.Input name="name" />
            </FormGroup>
            <FormGroup>
              <Label>Assign to</Label>
              <Form.Select
                name="user"
                placeholder="Select student"
                options={students}
                formatOptionLabel={userOption => (
                  <>
                    <UserAvatar user={userOption} size="small" />
                    <Text className="ms-2" inline>
                      {userOption.name}
                    </Text>
                  </>
                )}
              />
            </FormGroup>
            <hr />
            <Headline4>Schedule</Headline4>
            <Text>Optionally schedule a training for the future</Text>
            <Row>
              <Col>
                <FormGroup>
                  <Label>Time</Label>
                  <Form.Input type="datetime-local" name="date" />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Repeat weekly</Label>
                  <Form.Check type="switch" name="repeat" />
                </FormGroup>
              </Col>
            </Row>
            <Button type="submit">Start training</Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default TrainingAssign;
