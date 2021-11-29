import {
  ExerciseArrangePiecesStep,
  ExerciseModule,
  ExerciseQuestionnaireStep,
  ExerciseQuestionStep,
  ExerciseSegmentKeys,
  ExerciseSelectSquaresAndPiecesStep,
  ExerciseSteps,
  ExerciseTypes,
  ExerciseVariationStep,
  MoveStep,
  VariationStep,
} from '@types';
import {
  Chapter,
  createService,
  createStep as coreCreateStep,
  getParentStep,
  isStep,
  Step,
  StepRoot,
  StepType,
} from '@chess-tent/models';
import { constants } from '@application';
import { stepType } from './model';

const { START_FEN } = constants;

export const createExerciseStepState = <T extends ExerciseSteps>(
  exerciseType: ExerciseTypes,
  initialState: Parameters<ExerciseModule<T>['createStep']>[1],
): T['state'] => ({
  steps: [],
  exerciseType,
  activeSegment: 'task',
  orientation: initialState.orientation,
  task: {
    position: initialState.position,
    text: initialState.task?.text,
  },
  hint: {
    text: initialState.hint?.text,
  },
  explanation: {
    text: initialState.explanation?.text,
  },
});

export const createStep = (
  id: string,
  initialState: Parameters<
    ExerciseModule<ExerciseVariationStep>['createStep']
  >[1],
) =>
  coreCreateStep<ExerciseVariationStep>(
    id,
    stepType,
    createExerciseStepState<ExerciseVariationStep>('variation', initialState),
  );

export const getParent = (
  stepRoot: StepRoot<Step<{}, StepType>>,
  step: ExerciseSteps,
) => {
  return getParentStep(stepRoot, step) as VariationStep | MoveStep | Chapter;
};

export const getPositionAndOrientation = (
  stepRoot: StepRoot<Step<{}, StepType>>,
  step: ExerciseSteps,
) => {
  const parent = getParent(stepRoot, step);
  if (isStep(parent)) {
    return {
      position:
        parent.state.move?.position ||
        (parent as VariationStep).state.position ||
        START_FEN,
      orientation: step.state.orientation,
    };
  } else {
    return {
      position: step.state.task.position,
      orientation: step.state.orientation,
    };
  }
};

export const getInitialExerciseStepState = (
  stepRoot: StepRoot<Step<{}, StepType>>,
  step: ExerciseSteps,
  exerciseType: ExerciseTypes,
) => {
  const { position } = getPositionAndOrientation(stepRoot, step);
  return createExerciseStepState(exerciseType, {
    position,
    ...step.state,
  });
};

export const changeExercise = createService(
  <T extends ExerciseSteps>(
    step: T,
    stepRoot: StepRoot<Step<{}, StepType>>,
    exerciseType: ExerciseTypes,
  ): T => {
    step.state = getInitialExerciseStepState(
      stepRoot,
      step,
      exerciseType as ExerciseTypes,
    );
    return step;
  },
);

export const getSegmentKey = (
  step: ExerciseSteps,
  segment: ExerciseSteps['state'][ExerciseSegmentKeys],
): ExerciseSegmentKeys => {
  if (step.state.task === segment) {
    return 'task';
  }
  if (step.state.explanation === segment) {
    return 'explanation';
  }
  if (step.state.hint === segment) {
    return 'hint';
  }
  throw new Error('Unknown segment');
};

export const hasExplanation = (step: ExerciseSteps) =>
  step.state.explanation.text || !!step.state.explanation.shapes?.length;

export const hasHint = (step: ExerciseSteps) =>
  step.state.hint.text || !!step.state.hint.shapes?.length;

export const isVariationExerciseStep = (
  step: ExerciseSteps,
): step is ExerciseVariationStep => step.state.exerciseType === 'variation';
export const isQuestionnaireExerciseStep = (
  step: ExerciseSteps,
): step is ExerciseQuestionnaireStep =>
  step.state.exerciseType === 'questionnaire';
export const isQuestionExerciseStep = (
  step: ExerciseSteps,
): step is ExerciseQuestionStep => step.state.exerciseType === 'question';
export const isSelectSquarePiecesExerciseStep = (
  step: ExerciseSteps,
): step is ExerciseSelectSquaresAndPiecesStep =>
  step.state.exerciseType === 'select-squares-pieces';
export const isArrangePiecesExerciseStep = (
  step: ExerciseSteps,
): step is ExerciseArrangePiecesStep =>
  step.state.exerciseType === 'arrange-pieces';
