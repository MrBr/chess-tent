import React from 'react';
import { components, hooks, ui } from '@application';

const { Page, Trainings } = components;
const { useUserTrainings, useActiveUserRecord, useOpenTraining } = hooks;
const { Headline4, Text } = ui;

const Studies: React.FC = () => {
  const { value: user } = useActiveUserRecord();
  const { value: trainings } = useUserTrainings(user);

  const handleTrainingClick = useOpenTraining();

  return (
    <Page>
      <Page.Body>
        <Headline4 className="m-0 mt-4">Studies 📖</Headline4>
        <Text className="mb-5">Your learning activities.</Text>
        <Trainings
          trainings={trainings}
          onTrainingClick={handleTrainingClick}
        />
      </Page.Body>
    </Page>
  );
};

export default Studies;
