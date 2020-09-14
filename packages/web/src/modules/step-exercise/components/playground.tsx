import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';

import VariationPlayground from './playground-variation';
import QuestionPlayground from './playground-question';
import QuestionnairePlayground from './playground-questionnaire';
import SelectSquaresPiecesPlayground from './playground-select-squares-pieces';
import ArrangePiecesPlayground from './playground-arrange-pieces';

const Playground: FunctionComponent<ComponentProps<
  ExerciseModule['Playground']
>> = props => {
  switch (props.step.state.exerciseType) {
    case 'variation':
      return <VariationPlayground {...props} />;
    case 'question':
      return <QuestionPlayground {...props} />;
    case 'questionnaire':
      return <QuestionnairePlayground {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesPlayground {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesPlayground {...props} />;
    default:
      return null;
  }
};

export default Playground;
