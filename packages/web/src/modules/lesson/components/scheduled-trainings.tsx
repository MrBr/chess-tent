import React from 'react';
import { ui, components } from '@application';
import { Components } from '@types';

const { TrainingScheduledCard } = components;

const { Row, Col } = ui;

const ScheduledTrainings: Components['ScheduledTrainings'] = ({
  trainings,
}) => {
  if (trainings.length === 0) {
    return null;
  }

  return (
    <Row>
      {trainings.map(activity => (
        <Col md={4} sm={6} xs={12} className="mt-4">
          <TrainingScheduledCard training={activity} key={activity.id} />
        </Col>
      ))}
    </Row>
  );
};

export default ScheduledTrainings;
