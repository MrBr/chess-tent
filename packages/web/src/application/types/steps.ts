import { Step, StepType } from '@chess-tent/models';
import { FEN, Key, NotableMove, Shape } from './chess';
import { ActivityStepState, StepModule } from './step';

// Move
export type MoveStepState = {
  shapes: Shape[];
  description?: string;
  move: NotableMove;
  steps: Step[];
};
export type MoveStep = Step<MoveStepState, 'move'>;
export type MoveModule = StepModule<MoveStep, 'move', { move: NotableMove }>;

// Variation
export type VariationStepState = {
  shapes: Shape[];
  position?: FEN;
  description?: string;
  steps: (VariationStep | DescriptionStep | ExerciseStep)[];
  editing?: boolean;
  moveIndex?: number;
  // Used for variations derived from previous line.
  // Editing position for specific variation from unrelated position (line) will clear move.
  move?: NotableMove | null;
};
export type VariationStep = Step<VariationStepState, 'variation'>;
export type VariationModule = StepModule<VariationStep, 'variation'>;

// Description
export type DescriptionStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[]; // Dead end - description step shouldn't have children
};
export type DescriptionStep = Step<DescriptionStepState, 'description'>;
export type DescriptionModule = StepModule<
  DescriptionStep,
  'description',
  { position: DescriptionStepState['position'] }
>;

// Exercise
export type ExerciseMove = NotableMove & { shapes: Shape[] };
export interface ExerciseVariationState {
  editing?: boolean;
  question?: string;
  explanation?: string;
  moves?: ExerciseMove[];
  activeMoveIndex?: number;
}
export type ExerciseVariationActivityState = ActivityStepState<{
  moves?: { [key: number]: NotableMove };
  activeMoveIndex?: number;
}>;

export interface ExerciseSelectSquaresAndPiecesState {
  question?: string;
  explanation?: string;
}
export type ExerciseActivitySelectSquaresAndPiecesState = ActivityStepState<{
  selectedShapes: Shape[];
}>;

export interface ExerciseArrangePiecesState {
  question?: string;
  explanation?: string;
  moves?: NotableMove[];
  editing?: boolean;
}
export type ExerciseActivityArrangePiecesState = ActivityStepState<{
  moves?: NotableMove[];
  invalidPiece?: Key; // Piece at key
}>;
export interface ExerciseQuestionState {
  question?: string;
  explanation?: string;
}
export type ExerciseQuestionActivityState = ActivityStepState<{
  answer?: string;
}>;

export interface ExerciseQuestionnaireState {
  question?: string;
  explanation?: string;
  options?: { correct: boolean; text: string }[];
}
export type ExerciseQuestionnaireActivityState = ActivityStepState<{
  selectedOptionIndex?: number;
}>;

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
export type ExerciseToolboxProps = {
  step: ExerciseStep;
  updateStep: (step: Step<ExerciseStepState>) => void;
};
export type ExerciseStep = Step<ExerciseStepState, 'exercise'>;
export type ExerciseModule = StepModule<
  ExerciseStep,
  'exercise',
  { position: ExerciseStepState['position'] },
  ExerciseActivityState
>;

export type Steps = MoveStep | DescriptionStep | VariationStep | ExerciseStep;

type ModuleRecord<K extends StepType, T> = {
  [P in K]: T extends StepModule<infer U, infer S, infer Z, infer Y>
    ? S extends P
      ? T
      : never
    : never;
};
export type StepModules = ModuleRecord<
  StepType,
  MoveModule | VariationModule | DescriptionModule | ExerciseModule
>;
