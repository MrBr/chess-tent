import React from 'react';
import { ui } from '@application';
import { Components } from '@types';
import { useUserTrainings } from '../hooks';
import TrainingCard from './training-card';

const { Container, Row, Col } = ui;

const Trainings: Components['Trainings'] = ({ user }) => {
  const [trainings] = useUserTrainings(user);
  return (
    <Container>
      <Row>
        {trainings?.map(training => (
          <Col sm={3}>
            <TrainingCard key={training.id} training={training} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Trainings;