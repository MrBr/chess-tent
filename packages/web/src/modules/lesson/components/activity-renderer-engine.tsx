import React from 'react';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components } from '@application';

const { Evaluation, LessonPlaygroundCard } = components;

export class ActivityRendererAnalysisEngineCard<
  T extends Steps | undefined,
> extends React.Component<ActivityRendererModuleProps<T>> {
  render() {
    return (
      <LessonPlaygroundCard className="stretch">
        <Evaluation />
      </LessonPlaygroundCard>
    );
  }
}
