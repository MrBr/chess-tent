import React from 'react';
import {
  ActivityRendererModuleProps,
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
  nextStep: () => void;
  prevStep: () => void;
}

export abstract class ActivityAnalysis<
  T extends ActivityAnalysisProps<any>,
> extends React.Component<T> {
  protected analysisRef: React.RefObject<AnalysisBaseInterface>;
  constructor(props: T) {
    super(props);
    this.analysisRef = React.createRef<AnalysisBaseInterface>();
  }

  isAnalysing(props = this.props) {
    const { boardState, step } = props;
    return boardState.analyising && boardState.activeStepId === step?.id;
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
    const { analysis, nextStep } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const step = getNextStep(
      analysis,
      activeStep,
      ({ stepType }) => stepType !== 'variation',
    );

    if (!step) {
      nextStep();
      return;
    }
    this.setActiveStep(step);
  };

  prevVariation = () => {
    const { analysis, prevStep } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const step = getPreviousStep(
      analysis,
      activeStep,
      ({ stepType }) => stepType !== 'variation',
    );

    if (!step) {
      prevStep();
      return;
    }
    step && this.setActiveStep(step);
  };

  nextStep = () => {
    const { analysis, nextStep } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const variationStep = getParentStep(analysis, activeStep);
    const step =
      getFirstStep(activeStep, false, ({ stepType }) => stepType !== 'move') ||
      getRightStep(
        variationStep as Steps,
        activeStep,
        step => step.stepType === 'variation',
      );

    if (!step) {
      nextStep();
      return;
    }
    this.setActiveStep(step);
  };

  prevStep = () => {
    const { analysis, prevStep } = this.props;
    const activeStep = getAnalysisActiveStep(analysis);
    const step = getLeftStep(
      analysis,
      activeStep,
      (step, index) => index > -1 && step.stepType === 'variation',
    );

    if (!step) {
      prevStep();
      return;
    }
    this.setActiveStep(step);
  };

  closeAnalysis = () => {
    const { updateActivity, activity, boardState } = this.props;
    updateActivity(
      applyUpdates(activity)(draft => {
        const activityStepStateDraft = getLessonActivityBoardState(
          draft,
          boardState.id,
        );
        activityStepStateDraft.analysing = true;
      }),
    )();
  };

  updateStepActivityAnalysis: AnalysisSystemProps['updateAnalysis'] =
    service => {
      const { updateActivity, activity, boardState } = this.props;
      updateActivity(
        applyUpdates(activity)(draft => {
          const activityStepStateDraft = getLessonActivityBoardState(
            draft,
            boardState.id,
          );
          activityStepStateDraft.analysing = true;
          service(activityStepStateDraft.analysis);
        }),
      )();
    };
}
