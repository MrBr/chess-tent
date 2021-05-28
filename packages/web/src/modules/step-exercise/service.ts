import {
  ExerciseArrangePiecesStep,
  ExerciseModule,
  ExerciseQuestionnaireStep,
  ExerciseQuestionStep,
  ExerciseSelectSquaresAndPiecesStep,
  ExerciseSteps,
  ExerciseTypes,
  ExerciseVariationStep,
  MoveStep,
  PieceColor,
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
  position: string,
  orientation?: PieceColor,
): T['state'] => ({
  steps: [],
  exerciseType,
  activeSegment: 'task',
  orientation,
  task: {
    position,
  },
  hint: {
    position,
  },
  explanation: {
    position,
  },
});

export const createStep: ExerciseModule<ExerciseSteps>['createStep'] = (
  id,
  { position, orientation },
) =>
  coreCreateStep<ExerciseVariationStep>(
    id,
    stepType,
    createExerciseStepState<ExerciseVariationStep>(
      'variation',
      position,
      orientation,
    ),
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
  const { position, orientation } = getPositionAndOrientation(stepRoot, step);
  return createExerciseStepState(exerciseType, position, orientation);
};

export const changeExercise = createService(
  <T extends ExerciseSteps>(
    step: T,
    stepRoot: StepRoot<Step<{}, StepType>>,
    exerciseType: ExerciseTypes,
  ): T => {
    const initialExerciseStepState = getInitialExerciseStepState(
      stepRoot,
      step,
      exerciseType as ExerciseTypes,
    );
    step.state = initialExerciseStepState;
    return step;
  },
);

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
