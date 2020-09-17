import React from 'react';
import { ExerciseToolboxProps } from '@types';

import QuestionnaireExercise from './toolbox-questionnaire';
import QuestionExercise from './toolbox-question';
import BoardExercise from './toolbox-variation';
import SelectSquaresPiecesExercise from './toolbox-select-squares-pieces';
import ArrangePiecesExercise from './toolbox-arrange-pieces';

export default ({ step, ...props }: ExerciseToolboxProps) => {
  const { exerciseType } = step.state;
  switch (exerciseType) {
    case 'variation':
      return <BoardExercise step={step} {...props} />;
    case 'question':
      return <QuestionExercise step={step} {...props} />;
    case 'questionnaire':
      return <QuestionnaireExercise step={step} {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesExercise step={step} {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesExercise step={step} {...props} />;
    default:
      return null;
  }
};
