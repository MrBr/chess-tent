import React, { useCallback, useEffect, useState } from 'react';
import merge from 'lodash/merge';

import { Hooks, WizardStep } from '@types';

const useWizard: Hooks['useWizard'] = <T extends {}>(
  steps: WizardStep<T>[],
  initialState: T,
) => {
  const [state, setState] = useState<T>(initialState);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([steps[0]]));
  const [completedSteps, setCompletedSteps] = useState(
    new Set(steps.filter(step => !step.required)),
  );

  const activeStep = steps[activeStepIndex];

  const completeStep = useCallback(
    (status = true) => {
      setCompletedSteps(prevState => {
        const newCompletedSteps = new Set(Array.from(prevState));
        if (status) {
          newCompletedSteps.add(activeStep);
        } else {
          newCompletedSteps.delete(activeStep);
        }
        return newCompletedSteps;
      });
    },
    [activeStep],
  );

  const nextStep = useCallback(() => {
    if (activeStepIndex >= steps.length - 1 || completedSteps.has(activeStep)) {
      return;
    }

    setActiveStepIndex(activeStepIndex + 1);
  }, [activeStep, activeStepIndex, completedSteps, steps.length]);

  const prevStep = useCallback(() => {
    if (activeStepIndex <= 0) {
      return;
    }

    setActiveStepIndex(activeStepIndex - 1);
  }, [activeStepIndex]);

  const setActiveStep = useCallback(
    newStep => {
      const newActiveIndex = steps.findIndex(step => step === newStep);

      // check if all previous steps are completed
      let prevStepsCompleted = true;
      steps.some((step, index) => {
        if (!completedSteps.has(step) && index !== newActiveIndex) {
          prevStepsCompleted = false;
        }

        return index === newActiveIndex;
      });

      if (newActiveIndex !== -1 && prevStepsCompleted) {
        setActiveStepIndex(newActiveIndex);
      }
    },
    [completedSteps, steps],
  );

  const updateState = useCallback(newState => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const mergeUpdateState = useCallback(newState => {
    setState(prevState => merge({}, prevState, newState));
  }, []);

  const resetWizardState = useCallback(newState => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const node = (
    <activeStep.Component
      completeStep={completeStep}
      nextStep={nextStep}
      prevStep={prevStep}
      state={state}
      updateState={updateState}
      mergeUpdateState={mergeUpdateState}
      completed={completedSteps.has(activeStep)}
    />
  );

  useEffect(() => {
    if (!visitedSteps.has(activeStep)) {
      const newVisited = new Set(visitedSteps);

      newVisited.add(activeStep);
      setVisitedSteps(newVisited);
    }
  }, [setVisitedSteps, visitedSteps, activeStep]);

  return {
    activeStep,
    activeStepIndex,
    node,
    nextStep,
    prevStep,
    resetWizardState,
    setActiveStep,
    updateState,
    mergeUpdateState,
    steps,
    visitedSteps,
    completeStep,
  };
};

export default useWizard;
