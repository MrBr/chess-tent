import React from 'react';
import { ActivityRendererModuleProps, Steps } from '@types';
import { components } from '@application';

const { Evaluation, LessonPlaygroundCard } = components;

export class ActivityRendererAnalysisEngineCard<
  T extends Steps | undefined,
> extends React.Component<ActivityRendererModuleProps<T>> {
  render() {
    const { activity } = this.props;

    if (activity.state.disableEngine) {
      return null;
    }

    return (
      <LessonPlaygroundCard stretch>
        <Evaluation />
      </LessonPlaygroundCard>
    );
  }
}
