import React from 'react';
import { Steps } from '@types';
import { components } from '@application';

import { ActivityAnalysis, ActivityAnalysisProps } from './activity-analysis';

const { AnalysisSidebar } = components;

class ActivityStepperAnalysis<
  T extends Steps | undefined,
> extends ActivityAnalysis<ActivityAnalysisProps<T>> {
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
