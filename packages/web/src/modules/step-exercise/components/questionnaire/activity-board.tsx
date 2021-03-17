import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule, ExerciseQuestionnaireStep } from '@types';
import { SegmentActivityBoard } from '../segment';

const Playground: FunctionComponent<
  ComponentProps<ExerciseModule<ExerciseQuestionnaireStep>['ActivityBoard']>
> = props => {
  return <SegmentActivityBoard {...props} />;
};

export default Playground;
