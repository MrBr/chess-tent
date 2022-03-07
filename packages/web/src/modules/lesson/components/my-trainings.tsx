import React from 'react';
import { ui, components } from '@application';
import { Components } from '@types';

const { TrainingCard } = components;

const { Container, Row, Col, Headline3 } = ui;

const MyTrainings: Components['MyTrainings'] = ({ trainings }) => {
  if (trainings.length === 0) {
    return null;
  }

  return (
    <Container fluid>
      <Headline3>Practice with mentor</Headline3>
      {trainings.map(activity => (
        <Row>
          <Col md={8} xs={12} className="mt-4">
            <Row>
              <Col md={6} xs={12} className="mb-4" key={activity.id}>
                <TrainingCard training={activity} />
              </Col>
            </Row>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default MyTrainings;
