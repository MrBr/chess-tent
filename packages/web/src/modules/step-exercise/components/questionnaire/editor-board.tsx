import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionnaireStep } from '@types';
import { SegmentBoard } from '../segment';

const Editor: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionnaireStep>['EditorBoard']>
> = props => {
  return <SegmentBoard {...props} />;
};

export default Editor;
