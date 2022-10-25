import React from 'react';
import {
  ActivityRendererModuleProps,
  ActivityStepMode,
  AnalysisBaseInterface,
  AnalysisSystemProps,
  Steps,
} from '@types';
import { constants, services } from '@application';
import {
  getAnalysisActiveStep,
  getLessonActivityBoardState,
  applyUpdates,
  getRightStep,
  getLeftStep,
  Step,
  updateActivityStepState,
  getParentStep,
  getFirstStep,
  getNextStep,
  getPreviousStep,
} from '@chess-tent/models';

const { START_FEN } = constants;

export interface ActivityAnalysisProps<T extends Steps | undefined> {
  activityStepState: ActivityRendererModuleProps<T>['activityStepState'];
  step?: ActivityRendererModuleProps<T>['step'];
  analysis: ActivityRendererModuleProps<T>['analysis'];
  updateActivity: ActivityRendererModuleProps<T>['updateActivity'];
  activity: ActivityRendererModuleProps<T>['activity'];
  boardState: ActivityRendererModuleProps<T>['boardState'];
}

export abstract class ActivityAnalysis<
  T extends ActivityAnalysisProps<any>,
> extends React.Component<T> {
  protected analysisRef: React.RefObject<AnalysisBaseInterface>;
  constructor(props: T) {
    super(props);
    this.analysisRef = React.createRef<AnalysisBaseInterface>();
  }

  isAnalysing() {
    const { activityStepState, boardState, step } = this.props;
    return (
      activityStepState.mode === ActivityStepMode.ANALYSING &&
      boardState.activeStepId === step?.id
    );
  }

  getInitialPosition() {
    const { step } = this.props;
    return step ? services.getStepPosition(step) : START_FEN;
  }

  getInitialOrientation() {
    const { step } = this.props;
    return step ? services.getStepBoardOrientation(step) : undefined;
  }

  setActiveStep(step: Step) {
    this.updateStepActivityAnalysis(analysis => {
      analysis.state.activeStepId = step.id;
    });
  }

  nextVariation = () => {
    const { analysis } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const nextStep = getNextStep(
      analysis,
      activeStep,
      ({ stepType }) => stepType !== 'variation',
    );
    nextStep && this.setActiveStep(nextStep);
  };

  prevVariation = () => {
    const { analysis } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const prevStep = getPreviousStep(
      analysis,
      activeStep,
      ({ stepType }) => stepType !== 'variation',
    );

    prevStep && this.setActiveStep(prevStep);
  };

  nextStep = () => {
    const { analysis } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const variationStep = getParentStep(analysis, activeStep);
    const nextStep =
      getFirstStep(activeStep, false, ({ stepType }) => stepType !== 'move') ||
      getRightStep(
        variationStep as Steps,
        activeStep,
        step => step.stepType === 'variation',
      );
    nextStep && this.setActiveStep(nextStep);
  };

  prevStep = () => {
    const { analysis } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const prevStep = getLeftStep(
      analysis,
      activeStep,
      (step, index) => index > -1 && step.stepType === 'variation',
    );
    prevStep && this.setActiveStep(prevStep);
  };

  closeAnalysis = () => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(updateActivityStepState)(activity, boardState, {
      mode: ActivityStepMode.SOLVING,
    });
  };

  updateStepActivityAnalysis: AnalysisSystemProps['updateAnalysis'] =
    service => {
      const { updateActivity, activity, boardState } = this.props;
      updateActivity(
        applyUpdates(activity)(draft => {
          const activityStepStateDraft = getLessonActivityBoardState(
            draft,
            boardState.id,
          )[boardState.activeStepId];
          activityStepStateDraft.mode = ActivityStepMode.ANALYSING;
          service(activityStepStateDraft.analysis);
        }),
      )();
    };
}
