import { Step } from '@chess-tent/models';
import { FEN, Move, NotableMove, Piece, Shape } from './chess';
import { StepModule } from './step';

// Move
export type MoveStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  move?: Move;
  steps: Step[];
  moveIndex: number;
  movedPiece?: Piece;
  captured?: boolean;
};
export type MoveStep = Step<MoveStepState, 'move'>;
export type MoveModule = StepModule<MoveStep, 'move'>;

// Variation
export type VariationStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
  editing?: boolean;
  moveIndex: number;
};
export type VariationStep = Step<VariationStepState, 'variation'>;
export type VariationModule = StepModule<VariationStep, 'variation'>;

// Description
export type DescriptionStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
};
export type DescriptionStep = Step<DescriptionStepState, 'description'>;
export type DescriptionModule = StepModule<DescriptionStep, 'description'>;

// Exercise
export type ExerciseMove = NotableMove & { shapes: Shape[] };
export interface ExerciseVariationState {
  editing?: boolean;
  question?: string;
  explanation?: string;
  moves?: ExerciseMove[];
  activeMoveIndex?: number;
}
export interface ExerciseVariationActivityState {
  moves?: { [key: number]: NotableMove };
  activeMoveIndex?: number;
}

export interface ExerciseSelectSquaresAndPiecesState {
  question?: string;
  explanation?: string;
}
export interface ExerciseActivitySelectSquaresAndPiecesState {
  selectedShapes: Shape[];
}

export interface ExerciseArrangePiecesState {
  question?: string;
  explanation?: string;
  moves?: NotableMove[];
  editing?: boolean;
}
export interface ExerciseActivityArrangePiecesState {
  moves?: NotableMove[];
}
export interface ExerciseQuestionState {
  question?: string;
  explanation?: string;
}
export interface ExerciseQuestionActivityState {
  answer?: string;
}

export interface ExerciseQuestionnaireState {
  question?: string;
  explanation?: string;
  options?: { correct: boolean; text: string }[];
}
export interface ExerciseQuestionnaireActivityState {
  selectedOptionIndex?: number;
}

export type ExerciseActivityState =
  | ExerciseQuestionActivityState
  | ExerciseVariationActivityState
  | ExerciseQuestionnaireActivityState
  | ExerciseActivitySelectSquaresAndPiecesState
  | ExerciseActivityArrangePiecesState;

export type ExerciseState =
  | ExerciseVariationState
  | ExerciseQuestionState
  | ExerciseQuestionnaireState
  | ExerciseSelectSquaresAndPiecesState
  | ExerciseArrangePiecesState;

export type ExerciseTypes =
  | 'questionnaire'
  | 'question'
  | 'arrange-pieces'
  | 'select-squares-pieces'
  | 'variation';
export type ExerciseStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  exerciseState: ExerciseState;
  exerciseType: ExerciseTypes;
  steps: Step[];
};
export type ExerciseStep = Step<ExerciseStepState, 'exercise'>;
export type ExerciseModule = StepModule<
  ExerciseStep,
  'exercise',
  ExerciseActivityState
>;

export type Steps = MoveStep | DescriptionStep | VariationStep | ExerciseStep;
