import {
  ExerciseArrangePiecesStep,
  ExerciseModule,
  ExerciseQuestionnaireStep,
  ExerciseQuestionStep,
  ExerciseSelectSquaresAndPiecesStep,
  ExerciseSteps,
  ExerciseVariationStep,
} from '@types';
import {
  createStep as coreCreateStep,
  updateStepState,
} from '@chess-tent/models';
import { stepType } from './model';

export const updateExerciseStep = <T extends ExerciseSteps>(
  step: T,
  state: Partial<T['state']>,
): T =>
  updateStepState(step, {
    ...state,
  });

export const createStep: ExerciseModule<ExerciseVariationStep>['createStep'] = (
  id,
  { position, orientation },
) =>
  coreCreateStep<ExerciseVariationStep>(id, stepType, {
    steps: [],
    exerciseType: 'variation',
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
