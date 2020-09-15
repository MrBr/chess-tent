import React, { useCallback, useEffect } from 'react';
import { hooks, requests, ui, utils } from '@application';
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
  Avatar,
  Thumbnail,
  Text,
  Modal,
} = ui;
const { useApi, useActiveUserRecord } = hooks;
const { generateIndex } = utils;

const TrainingSchema = yup.object().shape({
  user: yup.string().required(),
  lesson: yup.string().required(),
});

export default ({ close }: { close: () => void }) => {
  const { fetch: saveActivity } = useApi(requests.activitySave);
  const [user] = useActiveUserRecord() as [User, never, never];
  const { fetch: fetchUserLessons, response } = useApi(requests.lessons);

  const assignTraining = useCallback(
    data => {
      const activityId = generateIndex();
      const activity = createActivity(activityId, data.lesson, data.user, {});
      saveActivity(activity);
    },
    [saveActivity],
  );

  useEffect(() => {
    fetchUserLessons({ owner: user.id });
  }, [fetchUserLessons, user.id]);

  return (
    <Modal show onEscapeKeyDown={close}>
      <ModalBody>
        <Headline3>New Training</Headline3>
        <Form
          initialValues={{ user: '', lesson: '' }}
          validationSchema={TrainingSchema}
          onSubmit={assignTraining}
        >
          <FormGroup>
            <Label>Assign to</Label>
            <Form.Select
              name="user"
              placeholder="test"
              options={[user]}
              formatOptionLabel={({ imageUrl, name }: User) => (
                <>
                  <Avatar src={imageUrl} /> <Text inline>{name}</Text>
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
                  <Text inline>{lesson.id}</Text>
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
