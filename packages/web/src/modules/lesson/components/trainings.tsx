import React from 'react';
import { ui, components } from '@application';
import { Components } from '@types';

const { TrainingCard } = components;

const { Row, Col } = ui;

const Trainings: Components['Trainings'] = ({ trainings }) => {
  if (!trainings || trainings.length === 0) {
    return null;
  }

  return (
    <Row>
      {trainings.map(activity => (
        <Col key={activity.id} className="col-auto mb-4">
          <TrainingCard training={activity} />
        </Col>
      ))}
    </Row>
  );
};

export default Trainings;
