import React, { useCallback, useEffect, useMemo } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Lesson, User } from '@chess-tent/models';
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
const { UserAvatar } = components;

const TrainingSchema = yup.object().shape({
  user: yup.string().required(),
  lesson: yup.string().required(),
});

export default ({ close }: { close: () => void }) => {
  const { value: user } = useActiveUserRecord();
  const { value: mentorship } = useStudents(user);
  const {
    new: newTraining,
    meta: { loading, loaded },
  } = useUserTrainings(user);
  const { fetch: fetchUserLessons, response } = useApi(requests.myLessons);

  const students = useMemo(() => mentorship?.map(({ student }) => student), [
    mentorship,
  ]);

  const assignTraining = useCallback(
    (data, helpers) => {
      newTraining(data.lesson, data.user, {}, [user]);
      helpers.resetForm();
    },
    [newTraining, user],
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
            {loading ? 'Assigning' : !!loaded ? 'Training assigned' : null}
          </Text>
        </Form>
      </ModalBody>
    </Modal>
  );
};
