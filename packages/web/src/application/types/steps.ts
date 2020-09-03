import { Step } from '@chess-tent/models';
import { FEN, Move, Piece, Shape } from './chess';
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

export type Steps = MoveStep | DescriptionStep | VariationStep;
