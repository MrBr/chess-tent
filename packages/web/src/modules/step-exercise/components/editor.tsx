import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';

import SelectEditor from './editor-select';
import QuestionEditor from './editor-question';
import BoardEditor from './editor-board';

const Editor: FunctionComponent<ComponentProps<
  ExerciseModule['Editor']
>> = props => {
  switch (props.step.state.exerciseType) {
    case 'board':
      return <BoardEditor {...props} />;
    case 'question':
      return <QuestionEditor {...props} />;
    case 'select':
      return <SelectEditor {...props} />;
    default:
      return null;
  }
};

export default Editor;
