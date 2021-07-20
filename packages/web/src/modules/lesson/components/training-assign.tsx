import React, { useCallback, useEffect, useMemo } from 'react';
import { components, hooks, requests, services, ui } from '@application';
import { Lesson, User, LessonActivity } from '@chess-tent/models';
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
const { useApi, useActiveUserRecord, useStudents, useUserTrainings } = hooks;
const { createActivity } = services;
const { UserAvatar } = components;

const TrainingSchema = yup.object().shape({
  user: yup.string().required(),
  lesson: yup.string().required(),
});

export default ({ close }: { close: () => void }) => {
  const { fetch: saveActivity, response: assignResponse, loading } = useApi(
    requests.activitySave,
  );
  const { value: user } = useActiveUserRecord();
  const { value: mentorship } = useStudents(user);
  const { push: pushTraining } = useUserTrainings(user);
  const { fetch: fetchUserLessons, response } = useApi(requests.myLessons);

  const students = useMemo(() => mentorship?.map(({ student }) => student), [
    mentorship,
  ]);

  const assignTraining = useCallback(
    (data, helpers) => {
      const activity = createActivity<LessonActivity>(
        data.lesson,
        data.user,
        { training: true },
        [user],
      );
      saveActivity(activity);
      pushTraining(activity);
      helpers.resetForm();
    },
    [pushTraining, saveActivity, user],
  );

  useEffect(() => {
    fetchUserLessons({});
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
          <Button type="submit" disabled={loading}>
            Assign
          </Button>
          <Text inline fontSize="small" className="ml-4">
            {loading
              ? 'Assigning'
              : !!assignResponse
              ? 'Training assigned'
              : null}
          </Text>
        </Form>
      </ModalBody>
    </Modal>
  );
};
