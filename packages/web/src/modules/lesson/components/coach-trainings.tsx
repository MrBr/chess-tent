import React from 'react';
import groupBy from 'lodash/groupBy';
import { ui, components } from '@application';
import { Components, LessonActivity } from '@types';

const { TrainingCard } = components;

const { Container, Row, Col, Card } = ui;

const CoachTrainings: Components['CoachTrainings'] = ({ trainings }) => {
  const groupByOwner = groupBy(trainings, activity => activity?.owner.id);

  const renderActivities = (activities: LessonActivity[], index: number) => {
    return (
      <Row key={index}>
        <Col md={4} xs={12}>
          <Card>{activities[0].owner.name}</Card>
        </Col>
        <Col md={8} xs={12} className="mt-4">
          <Row>
            {activities.map(activity => (
              <Col key={activity.id} sm={3}>
                <TrainingCard training={activity} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid>
      <Row>{Object.values(groupByOwner).map(renderActivities)}</Row>
    </Container>
  );
};

export default CoachTrainings;
