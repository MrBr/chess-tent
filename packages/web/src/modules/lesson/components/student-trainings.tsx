import React from 'react';
import { components, ui } from '@application';
import { Activity } from '@chess-tent/models';
import groupBy from 'lodash/groupBy';
import { Components } from '@types';

const { CoachCard, TrainingCard } = components;
const { Headline3, Container } = ui;

const StudentTrainings: Components['StudentTrainings'] = ({ trainings }) => {
  const groupByMentor = groupBy(
    trainings,
    //@ts-ignore
    activity => activity?.subject?.owner.id,
  );

  console.log({ groupByMentor });
  return (
    <Container fluid>
      <Headline3>My trainings</Headline3>
      {groupByMentor
        ? Object.values(groupByMentor).map((activities: Activity[]) => {
            let activitiesByMentor = [
              //@ts-ignore
              <CoachCard coach={activities[0].subject.owner} />,
            ];
            activities.forEach((activity: Activity) => {
              activitiesByMentor.push(
                //@ts-ignore
                <TrainingCard key={activity.id} training={activity} />,
              );
            });
            return activitiesByMentor;
          })
        : null}
      {/* <Row>
        {trainings?.map(training => (
          <Col key={training.id} sm={3}>
            <TrainingCard key={training.id} training={training} />
          </Col>
        ))}
      </Row> */}
    </Container>
  );
};

export default StudentTrainings;
