import {
  ExerciseArrangePiecesStep,
  ExerciseModule,
  ExerciseQuestionnaireStep,
  ExerciseQuestionStep,
  ExerciseSelectSquaresAndPiecesStep,
  ExerciseSteps,
  ExerciseTypes,
  ExerciseVariationStep,
  PieceColor,
} from '@types';
import { createStep as coreCreateStep } from '@chess-tent/models';
import { stepType } from './model';

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
