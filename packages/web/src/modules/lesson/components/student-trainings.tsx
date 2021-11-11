import React from 'react';
import { components, ui, hooks } from '@application';
import groupBy from 'lodash/groupBy';
import { Components } from '@types';
import { LessonActivity } from '@chess-tent/models';
import { isStudentTraining } from '../service';

const { TrainingCard, UserAvatar } = components;
const { Headline3, Container, Row, Col, Headline5, Card } = ui;
const { useStudents } = hooks;

const Trainings = ({ activities }: { activities: LessonActivity[] }) => (
  <Card className="mb-3" bg="white">
    <Row>
      <Col md={3} className="border-right">
        <Container className="mt-3 ml-2">
          <UserAvatar size="small" user={activities[0].owner} />
          <Headline5 className="ml-3" inline>
            {activities[0].owner.name}
          </Headline5>
        </Container>
      </Col>
      <Col md={9} className="w-100 pb-3">
        <Row>
          {activities.map(activity => (
            <Col md={6} key={activity.id} className="mt-3">
              <TrainingCard training={activity} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  </Card>
);

const StudentTrainings: Components['StudentTrainings'] = ({
  trainings,
  user,
}) => {
  const { value: students } = useStudents(user);
  const studentTrainings = trainings.filter(activity =>
    isStudentTraining(activity, students || [], user),
  );

  const groupedTrainings = groupBy(
    studentTrainings,
    training => training.users[0].id,
  );

  if (studentTrainings.length === 0) {
    return null;
  }

  return (
    <Container fluid>
      <Headline3>Mentor your students</Headline3>
      {Object.entries(groupedTrainings).map(([coachId, activities]) => (
        <Trainings activities={activities} key={coachId} />
      ))}
    </Container>
  );
};

export default StudentTrainings;
