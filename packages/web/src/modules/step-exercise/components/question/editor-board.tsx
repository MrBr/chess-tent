import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionStep } from '@types';
import { SegmentBoard } from '../segment';

const Editor: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['EditorBoard']>
> = props => {
  return <SegmentBoard {...props} />;
};

export default Editor;
