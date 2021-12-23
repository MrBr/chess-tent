import React from 'react';
import groupBy from 'lodash/groupBy';
import { ui, components, hooks } from '@application';
import { Components } from '@types';
import { LessonActivity } from '@chess-tent/models';
import { isMyTraining } from '../service';

const { TrainingCard, CoachCard } = components;

const { Container, Row, Col, Headline3 } = ui;
const { useCoaches } = hooks;

const Trainings = ({ activities }: { activities: LessonActivity[] }) => (
  <Row>
    <Col md={4} xs={12}>
      <CoachCard coach={activities[0].users[0]} />
    </Col>
    <Col md={8} xs={12} className="mt-4">
      <Row>
        {activities.map(activity => (
          <Col md={6} xs={12} className="mb-4" key={activity.id}>
            <TrainingCard training={activity} />
          </Col>
        ))}
      </Row>
    </Col>
  </Row>
);

const MyTrainings: Components['MyTrainings'] = ({ trainings, user }) => {
  const { value: coaches } = useCoaches(user);
  const myTrainings = trainings.filter(activity =>
    isMyTraining(activity, coaches || [], user),
  );
  const groupedTrainings = groupBy(
    myTrainings,
    activity => activity?.users[0]?.id,
  );

  if (myTrainings.length === 0) {
    return null;
  }

  return (
    <Container fluid>
      <Headline3>Practice with mentor</Headline3>
      {Object.entries(groupedTrainings).map(([studentId, activities]) => (
        <Trainings activities={activities} key={studentId} />
      ))}
    </Container>
  );
};

export default MyTrainings;
