import React, { useCallback, useEffect, useMemo } from 'react';
import { components, hooks, requests, ui } from '@application';
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

const TrainingAssign = ({ close }: { close: () => void }) => {
  const { value: user } = useActiveUserRecord();
  const { value: mentorship } = useStudents(user);
  const {
    new: newTraining,
    meta: { loading, loaded },
  } = useUserTrainings(user);
  const { fetch: fetchUserLessons, response } = useApi(requests.myLessons);

  const students = useMemo(
    () => mentorship?.map(({ student }) => student),
    [mentorship],
  );

  const assignTraining = useCallback(
    (data, helpers) => {
      newTraining(data.lesson, user, {}, [data.user]);
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
              formatOptionLabel={userOption => (
                <>
                  <UserAvatar user={userOption} size="small" />
                  <Text className="ml-2" inline>
                    {userOption.name}
                  </Text>
                </>
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>Lesson</Label>
            <Form.Select
              name="lesson"
              options={response?.data || []}
              formatOptionLabel={lesson => (
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
          <Text as="span" fontSize="small" className="ml-4">
            {loading ? 'Assigning' : !!loaded ? 'Training assigned' : null}
          </Text>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default TrainingAssign;
