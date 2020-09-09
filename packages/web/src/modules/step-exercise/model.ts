import { NotableMove, Shape } from '@types';

export interface BoardExerciseState {
  editing?: boolean;
  question?: string;
  explanation?: string;
  moves?: (NotableMove & { shapes: Shape[] })[];
  activeMoveIndex?: number;
}

export interface QuestionExerciseState {
  question?: string;
  explanation?: string;
}

export interface SelectExerciseState {
  question?: string;
  explanation?: string;
  options?: { correct: boolean; text: string }[];
}

export type ExerciseState =
  | BoardExerciseState
  | QuestionExerciseState
  | SelectExerciseState;
