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

  console.log({ groupByMentor });
  return (
    <Container fluid>
      <Headline3 className="ml-3">My trainings</Headline3>
      {Object.values(groupByMentor).map(activities => {
        return (
          <Row>
            <Col md={4}>
              <CoachCard coach={activities[0].subject.owner} />
            </Col>
            <Col md={8} className="mt-4">
              <Row>
                {activities.map(activity => {
                  return (
                    <Col md={6} className="mb-4">
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
