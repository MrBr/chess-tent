import React, { useCallback, useEffect, useMemo } from 'react';
import { components, hooks, requests, ui, utils } from '@application';
import { createActivity, Lesson, User } from '@chess-tent/models';
import * as yup from 'yup';
import lessonThumbUrl from '../images/lesson.svg';

const {
  Label,
  Headline3,
  FormGroup,
  Button,
  Form,
  ModalBody,
  Thumbnail,
  Text,
  Modal,
} = ui;
const { useApi, useActiveUserRecord, useStudents } = hooks;
const { generateIndex } = utils;
const { UserAvatar } = components;

const TrainingSchema = yup.object().shape({
  user: yup.string().required(),
  lesson: yup.string().required(),
});

export default ({ close }: { close: () => void }) => {
  const { fetch: saveActivity } = useApi(requests.activitySave);
  const [user] = useActiveUserRecord() as [User, never, never];
  const [mentorship] = useStudents(user);
  const { fetch: fetchUserLessons, response } = useApi(requests.lessons);

  const students = useMemo(() => mentorship?.map(({ student }) => student), [
    mentorship,
  ]);

  const assignTraining = useCallback(
    data => {
      const activityId = generateIndex();
      const activity = createActivity(activityId, data.lesson, data.user, {}, [
        user,
      ]);
      saveActivity(activity);
    },
    [saveActivity, user],
  );

  useEffect(() => {
    fetchUserLessons({ owner: user.id });
  }, [fetchUserLessons, user.id]);

  return (
    <Modal show close={close}>
      <ModalBody>
        <Headline3 className="mt-0">New Training</Headline3>
        <Form
          initialValues={{ user: '', lesson: '' }}
          validationSchema={TrainingSchema}
          onSubmit={assignTraining}
        >
          <FormGroup>
            <Label>Assign to</Label>
            <Form.Select
              name="user"
              placeholder="Select student"
              options={students}
              formatOptionLabel={(userOption: User) => (
                <>
                  <UserAvatar user={userOption} size="small" />
                  <Text inline>{userOption.name}</Text>
                </>
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>Lesson</Label>
            <Form.Select
              name="lesson"
              options={response?.data || []}
              formatOptionLabel={(lesson: Lesson) => (
                <>
                  <Thumbnail src={lessonThumbUrl} />
                  <Text inline>{lesson.state.title}</Text>
                </>
              )}
            />
          </FormGroup>
          <Button type="submit">Assign</Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};
