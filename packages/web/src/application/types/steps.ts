import { StepType } from '@chess-tent/models';
import { FEN, Key, NotableMove, Orientation, Shape } from './chess';
import { StepModule, AppStep, ActivityExerciseStepState } from './step';

// Move
export type MoveStepState = {
  shapes: Shape[];
  description?: string;
  move: NotableMove;
  steps: AppStep[];
};
export type MoveStep = AppStep<MoveStepState, 'move'>;
export type MoveModule = StepModule<MoveStep, 'move', { move: NotableMove }>;

// Variation
export type VariationStepState = {
  shapes: Shape[];
  position: FEN;
  description?: string;
  steps: (VariationStep | DescriptionStep | ExerciseSteps | MoveStep)[];
  editing?: boolean;
  moveIndex?: number;
  // Used for variations derived from previous line.
  // Editing position for specific variation from unrelated position (line) will clear move.
  move?: NotableMove | null;
};
export type VariationStep = AppStep<VariationStepState, 'variation'>;
export type VariationModule = StepModule<VariationStep, 'variation'>;

// Description
export type DescriptionStepState = {
  shapes: Shape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: AppStep[]; // Dead end - description step shouldn't have children
};
export type DescriptionStep = AppStep<DescriptionStepState, 'description'>;
export type DescriptionModule = StepModule<
  DescriptionStep,
  'description',
  { position: DescriptionStepState['position']; orientation?: Orientation }
>;

// Exercise
export interface Segment {
  text?: string;
  shapes?: Shape[];
}
export interface ExerciseSegments<T = {}> {
  explanation: Segment;
  hint: Segment;
  task: Segment & T & { position: FEN };
}

export type ExerciseSegmentKeys = keyof ExerciseSegments;

export type ExerciseMove = NotableMove & { shapes: Shape[] };
export type ExerciseVariationState = ExerciseSegments<{
  editing?: boolean;
  moves?: ExerciseMove[];
  activeMoveIndex?: number | null;
}>;
export type ExerciseVariationActivityState = ActivityExerciseStepState<{
  move?: NotableMove;
  correct?: boolean;
  activeMoveIndex?: number;
}>;

export type ExerciseSelectSquaresAndPiecesState = ExerciseSegments;
export type ExerciseActivitySelectSquaresAndPiecesState =
  ActivityExerciseStepState<{
    selectedShapes: Shape[];
  }>;

export type ExerciseArrangePiecesState = ExerciseSegments<{
  moves?: NotableMove[];
  editing?: boolean;
}>;
export type ExerciseActivityArrangePiecesState = ActivityExerciseStepState<{
  moves?: NotableMove[];
  invalidPiece?: Key; // Piece at key
}>;
export type ExerciseQuestionState = ExerciseSegments;

export type ExerciseQuestionActivityState = ActivityExerciseStepState<{
  answer?: string;
}>;

export type ExerciseQuestionnaireOption = {
  id: string;
  correct: boolean;
  text: string;
};
export type ExerciseQuestionnaireState = ExerciseSegments<{
  options?: ExerciseQuestionnaireOption[];
}>;
export type ExerciseQuestionnaireActivityState = ActivityExerciseStepState<{
  selectedOptions?: { [key: number]: boolean };
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

export type ExerciseStep<
  S extends ExerciseState,
  T extends ExerciseTypes,
> = AppStep<
  {
    activeSegment: keyof ExerciseSegments;
    exerciseType: T;
    steps: AppStep[];
  } & S,
  'exercise'
>;

export type ExerciseVariationStep = ExerciseStep<
  ExerciseVariationState,
  'variation'
>;
export type ExerciseArrangePiecesStep = ExerciseStep<
  ExerciseArrangePiecesState,
  'arrange-pieces'
>;
export type ExerciseSelectSquaresAndPiecesStep = ExerciseStep<
  ExerciseSelectSquaresAndPiecesState,
  'select-squares-pieces'
>;
export type ExerciseQuestionnaireStep = ExerciseStep<
  ExerciseQuestionnaireState,
  'questionnaire'
>;
export type ExerciseQuestionStep = ExerciseStep<
  ExerciseQuestionState,
  'question'
>;

export type ExerciseSteps =
  | ExerciseVariationStep
  | ExerciseArrangePiecesStep
  | ExerciseSelectSquaresAndPiecesStep
  | ExerciseQuestionStep
  | ExerciseQuestionnaireStep;

export type ExerciseToolboxProps<T extends ExerciseSteps = ExerciseSteps> = {
  step: T;
  updateStep: (step: AppStep) => void;
};

export type ExerciseModule<T extends ExerciseSteps = ExerciseSteps> =
  StepModule<
    T,
    'exercise',
    { position: FEN; orientation?: Orientation },
    ExerciseActivityState
  >;

export type Steps = MoveStep | DescriptionStep | VariationStep | ExerciseSteps;

type ModuleRecord<K extends StepType, T> = {
  [P in K]: T extends StepModule<any, infer S, any, any>
    ? S extends P
      ? T
      : never
    : never;
};
export type StepModules = ModuleRecord<
  StepType,
  | MoveModule
  | VariationModule
  | DescriptionModule
  | ExerciseModule<ExerciseSteps>
>;
