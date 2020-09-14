import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';

import QuestionnaireEditor from './editor-questionnaire';
import QuestionEditor from './editor-question';
import VariationEditor from './editor-variation';
import SelectSquaresPiecesEditor from './editor-select-squares-pieces';
import ArrangePiecesEditor from './editor-arrange-pieces';

const Editor: FunctionComponent<ComponentProps<
  ExerciseModule['Editor']
>> = props => {
  switch (props.step.state.exerciseType) {
    case 'variation':
      return <VariationEditor {...props} />;
    case 'question':
      return <QuestionEditor {...props} />;
    case 'questionnaire':
      return <QuestionnaireEditor {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesEditor {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesEditor {...props} />;
    default:
      return null;
  }
};

export default Editor;
