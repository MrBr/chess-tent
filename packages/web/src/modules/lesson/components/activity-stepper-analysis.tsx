import React from 'react';
import { applyUpdates, getLessonActivityBoardState } from '@chess-tent/models';
import { ActivityStepMode, Steps } from '@types';
import { components } from '@application';

import { ActivityAnalysis, ActivityAnalysisProps } from './activity-analysis';

const { AnalysisSidebar } = components;

class ActivityStepperAnalysis<
  T extends Steps | undefined,
> extends ActivityAnalysis<ActivityAnalysisProps<T>> {
  setAnalysingMode = () => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(
      applyUpdates(activity)(draft => {
        const activityStepStateDraft = getLessonActivityBoardState(
          draft,
          boardState.id,
        )[boardState.activeStepId];
        activityStepStateDraft.mode = ActivityStepMode.ANALYSING;
      }),
    )();
  };

  render() {
    const { analysis } = this.props;
    return (
      <AnalysisSidebar
        active={this.isAnalysing()}
        ref={this.analysisRef}
        analysis={analysis}
        updateAnalysis={this.updateStepActivityAnalysis}
        initialPosition={this.getInitialPosition()}
        initialOrientation={this.getInitialOrientation()}
      />
    );
  }
}

export default ActivityStepperAnalysis;
