import React, { useMemo, ReactElement } from 'react';
import { components, hooks, ui, utils } from '@application';
import * as yup from 'yup';
import { LessonActivity, LessonActivityRole, User } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';

export interface ActivityData {
  students?: User[];
  title?: string;
  date?: Date;
  weekly?: boolean;
}
interface ActivityFormProps {
  activity?: RecordValue<LessonActivity>;
  onSubmit: (data: ActivityData) => void;
  submitButton: ReactElement; // has to have type "submit"
}

const { Label, Headline5, FormGroup, Form, Text, Row, Col } = ui;
const { useActiveUserRecord, useStudents } = hooks;
const { dateToDatetimeLocal } = utils;
const { UserAvatar } = components;

const TrainingSchema = yup.object().shape({
  students: yup.array().of(yup.object()),
  title: yup.string(),
  date: yup.string(),
  weekly: yup.boolean(),
});

const ActivityForm = ({
  activity,
  onSubmit,
  submitButton,
}: ActivityFormProps) => {
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
      date: activity?.date
        ? (dateToDatetimeLocal(new Date(activity.date)) as unknown as Date)
        : undefined,
      weekly: activity?.weekly || false,
    }),
    [activity],
  );

  return (
    <Form
      initialValues={activityData}
      validationSchema={TrainingSchema}
      onSubmit={onSubmit}
    >
      <FormGroup>
        <Label>Training name</Label>
        <Form.Input name="title" />
      </FormGroup>
      <FormGroup className="mt-3">
        <Label>Assign to</Label>
        <Form.Select
          name="students"
          placeholder="Select student"
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
      <hr className="mt-4" />
      <Headline5 className="mt-4">Schedule</Headline5>
      <Text fontSize="small">
        Optionally schedule a training for the future
      </Text>
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
            <Form.Check type="switch" name="weekly" />
          </FormGroup>
        </Col>
      </Row>
      {submitButton}
    </Form>
  );
};

export default ActivityForm;
