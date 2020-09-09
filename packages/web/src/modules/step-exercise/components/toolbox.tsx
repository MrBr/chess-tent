import React from 'react';
import { ExerciseStep } from '@types';
import SelectExercise from './toolbox-select';
import QuestionExercise from './toolbox-question';
import BoardExercise from './toolbox-board';

export default ({ step }: { step: ExerciseStep }) => {
  const { exerciseType } = step.state;
  switch (exerciseType) {
    case 'board':
      return <BoardExercise step={step} />;
    case 'question':
      return <QuestionExercise step={step} />;
    case 'select':
      return <SelectExercise step={step} />;
    default:
      return null;
  }
};
