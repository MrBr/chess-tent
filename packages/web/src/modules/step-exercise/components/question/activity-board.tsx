import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionStep } from '@types';
import { SegmentActivityBoard } from '../segment';

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionStep>['ActivityBoard']>
> = props => {
  return <SegmentActivityBoard {...props} />;
};

export default Playground;
