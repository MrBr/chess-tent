import React from 'react';
import groupBy from 'lodash/groupBy';
import { ui, components } from '@application';
import { Components, LessonActivity } from '@types';

const { TrainingCard, UserAvatar } = components;

const { Container, Row, Col, Card, Headline5 } = ui;

const CoachTrainings: Components['CoachTrainings'] = ({ trainings }) => {
  const groupByOwner = groupBy(trainings, activity => activity?.owner.id);

  const renderActivities = (activities: LessonActivity[], index: number) => {
    return (
      <Card key={index} className="mb-3" bg="white">
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
  };

  return (
    <Container fluid>
      {Object.values(groupByOwner).map(renderActivities)}
    </Container>
  );
};

export default CoachTrainings;
