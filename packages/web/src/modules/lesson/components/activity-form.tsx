import React, { useMemo, RefObject } from 'react';
import { components, hooks, ui, utils } from '@application';
import * as yup from 'yup';
import { LessonActivity, LessonActivityRole, User } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import { FormikProps } from '@types';

export interface ActivityData {
  students?: User[];
  coaches?: User[];
  title?: string;
  date?: Date;
  weekly?: boolean;
}
interface ActivityFormProps {
  activity?: RecordValue<LessonActivity>;
  formRef?: RefObject<FormikProps<ActivityData>>;
}

const { Label, FormGroup, Form, Text, Row, Col } = ui;
const { useActiveUserRecord, useStudents } = hooks;
const { UserAvatar } = components;
const { noop } = utils;

const TrainingSchema = yup.object().shape({
  students: yup.array().of(yup.object()),
  title: yup.string(),
  date: yup.string(),
  weekly: yup.boolean(),
});

const ActivityForm = ({ activity, formRef }: ActivityFormProps) => {
  const { value: user } = useActiveUserRecord();
  const { value: mentorship } = useStudents(user);

  const students = useMemo(
    () => mentorship?.map(({ student }) => student),
    [mentorship],
  );

  const activityData = useMemo(
    () => ({
      students:
        activity?.roles
          .filter(({ role }) => role === LessonActivityRole.STUDENT)
          .map(({ user }) => user) || [],
      title: activity?.title || '',
      date: activity?.date ? (activity.date as unknown as Date) : undefined,
      weekly: activity?.weekly || false,
    }),
    [activity],
  );

  return (
    <Form
      initialValues={activityData}
      validationSchema={TrainingSchema}
      onSubmit={noop}
      innerRef={formRef}
    >
      <FormGroup>
        <Label>Training name</Label>
        <Form.Input name="title" />
      </FormGroup>
      <FormGroup className="mt-3">
        <Label>Students</Label>
        <Form.Select
          name="students"
          placeholder="Select students"
          options={students}
          isMulti
          formatOptionLabel={userOption => (
            <>
              <UserAvatar user={userOption} size="small" />
              <Text className="ms-2" inline>
                {userOption.name}
              </Text>
            </>
          )}
          getOptionValue={userOption => userOption.id}
        />
      </FormGroup>
      <hr className="mt-5" />
      <Text className="mt-4 mb-1" weight={400}>
        Schedule
      </Text>
      <Text fontSize="extra-small" className="mb-3">
        Optionally schedule a training
      </Text>
      <Row>
        <Col>
          <FormGroup>
            <Label>Time</Label>
            <Form.DateTime name="date" />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label>Repeat weekly</Label>
            <Form.Check type="switch" name="weekly" />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
};

export default ActivityForm;
