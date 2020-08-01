import React, { FunctionComponent } from 'react';
import { DrawShape } from 'chessground/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
} from '@chess-tent/models';
import { FEN, StepComponent, StepModule } from '@types';
import { stepModules } from '@application';

const stepType = 'description';

type DescriptionStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
};
type DescriptionStep = Step<DescriptionStepState, typeof stepType>;

type DescriptionModule = StepModule<DescriptionStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<DescriptionStep['state']>,
) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const getEndSetup: DescriptionModule['getEndSetup'] = ({
  state,
}: DescriptionStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const Editor: StepComponent<DescriptionStep> = ({ step, lesson, ...props }) => {
  const parentStep = getLessonParentStep(lesson, step) as Step;
  const ParentEditor = stepModules.getStepModule(parentStep.stepType).Editor;
  return <ParentEditor {...props} lesson={lesson} step={parentStep} />;
};

const Picker: FunctionComponent = () => {
  return <>Description</>;
};

const Playground: StepComponent<DescriptionStep> = () => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<DescriptionStep> = () => {
  return <>{'Description'}</>;
};

const ActionsComponent: StepComponent<DescriptionStep> = ({
  step,
  setActiveStep,
}) => {
  // const updateDescriptionDebounced = useCallback(
  //     _.debounce((description: string) => {
  //         dispatch(updateStepState(step, { description }));
  //     }, 500),
  //     [dispatch],
  // );
  //
  // const updateDescription = useCallback(
  //     e => {
  //         updateDescriptionDebounced(e.target.value);
  //     },
  //     [updateDescriptionDebounced],
  // );

  return <div onClick={() => setActiveStep(step)}>Comment</div>;
};

const Module: DescriptionModule = {
  Editor,
  Picker,
  Playground,
  Exercise,
  Actions: ActionsComponent,
  createStep,
  getEndSetup,
  stepType,
};

export default Module;
