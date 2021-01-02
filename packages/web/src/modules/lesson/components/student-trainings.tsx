import React from 'react';
import { components, ui } from '@application';
import groupBy from 'lodash/groupBy';
import { Components } from '@types';

const { CoachCard, TrainingCard } = components;
const { Headline3, Container, Row, Col } = ui;

const StudentTrainings: Components['StudentTrainings'] = ({ trainings }) => {
  const groupByMentor = groupBy(
    trainings,
    activity => activity?.subject?.owner.id,
  );

  return (
    <Container fluid>
      <Headline3 className="ml-3">My trainings</Headline3>
      {Object.values(groupByMentor).map((activities, index) => {
        return (
          <Row key={index}>
            <Col md={4} xs={12}>
              <CoachCard coach={activities[0].subject.owner} />
            </Col>
            <Col md={8} xs={12} className="mt-4">
              <Row>
                {activities.map(activity => {
                  return (
                    <Col md={6} xs={12} className="mb-4" key={activity.id}>
                      <TrainingCard key={activity.id} training={activity} />
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default StudentTrainings;
