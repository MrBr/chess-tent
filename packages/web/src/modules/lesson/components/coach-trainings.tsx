import React from 'react';
import { ui } from '@application';
import { Components } from '@types';
import { useUserTrainings } from '../hooks';
import TrainingCard from './training-card';

const { Container, Row, Col } = ui;

const CoachTrainings: Components['CoachTrainings'] = ({ user }) => {
  const [trainings] = useUserTrainings(user);
  return (
    <Container fluid>
      <Row>
        {trainings?.map(training => (
          <Col key={training.id} sm={3}>
            <TrainingCard key={training.id} training={training} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CoachTrainings;
