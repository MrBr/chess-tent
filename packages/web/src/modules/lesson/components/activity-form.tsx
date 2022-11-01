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
  state: { disableEngine?: boolean };
}
interface ActivityFormProps {
  activity?: RecordValue<LessonActivity>;
  formRef?: RefObject<FormikProps<ActivityData>>;
}

const { Label, FormGroup, Form, Text, Row, Col } = ui;
const { useStudents } = hooks;
const { UserAvatar } = components;
const { noop } = utils;

const TrainingSchema = yup.object().shape({
  students: yup.array().of(yup.object()),
  title: yup.string(),
  date: yup.string(),
  weekly: yup.boolean(),
});

const filterUsers = (
  option: { label: string; value: string; data: User },
  inputValue: string,
) =>
  !inputValue ? true : new RegExp(`^${inputValue}`, 'i').test(option.data.name);

const ActivityForm = ({ activity, formRef }: ActivityFormProps) => {
  const { value: mentorship } = useStudents();

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
      state: {
        disableEngine: !!activity?.state.disableEngine,
        hideMoves: !!activity?.state.hideMoves,
      },
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
          filterOption={filterUsers}
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
      <Row className="mt-3">
        <Col>
          <Label>Disable engine</Label>
          <Form.Check type="switch" name="state.disableEngine" />
        </Col>
        <Col>
          <Label>Hide moves</Label>
          <Form.Check type="switch" name="state.hideMoves" />
        </Col>
      </Row>
      <hr className="mt-3" />
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
