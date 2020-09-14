import React from 'react';
import { ExerciseStep } from '@types';

import QuestionnaireExercise from './toolbox-questionnaire';
import QuestionExercise from './toolbox-question';
import BoardExercise from './toolbox-variation';
import SelectSquaresPiecesExercise from './toolbox-select-squares-pieces';
import ArrangePiecesExercise from './toolbox-arrange-pieces';

export default ({ step }: { step: ExerciseStep }) => {
  const { exerciseType } = step.state;
  switch (exerciseType) {
    case 'variation':
      return <BoardExercise step={step} />;
    case 'question':
      return <QuestionExercise step={step} />;
    case 'questionnaire':
      return <QuestionnaireExercise step={step} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesExercise step={step} />;
    case 'arrange-pieces':
      return <ArrangePiecesExercise step={step} />;
    default:
      return null;
  }
};
