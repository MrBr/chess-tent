import { ComponentType, FunctionComponent } from 'react';

export type StepProps<S, P = {}> = {
  setState: (state: Partial<S>) => void;
  state: S;
} & P;

export type StepComponent<S> = ComponentType<StepProps<S>>;

export type StepType =
  | 'attack'
  | 'description'
  | 'select-pieces'
  | 'select-squares';
export type StepModuleComponentKey =
  | 'Editor'
  | 'Picker'
  | 'Playground'
  | 'Exercise';

export type StepModule = {
  Picker: FunctionComponent;
  Editor: StepComponent<any>;
  Playground: StepComponent<any>;
  Exercise: StepComponent<any>;
  type: StepType;
};

export type StepInstance = {
  id: string;
  type: StepType;
  state: any;
};

export interface AppState {
  trainer: ExerciseState;
}

export enum ExerciseActionTypes {
  SET_EXERCISE_STATE = 'SET_EXERCISE_STATE',
  SET_STEP_STATE = 'SET_STEP_STATE',
}

export interface ExerciseState {
  steps: StepInstance[];
  activeStepId: StepInstance['id'] | null;
}

export interface SetExerciseStateAction {
  type: ExerciseActionTypes.SET_EXERCISE_STATE;
  payload: Partial<ExerciseState>;
}

export interface SetStepAction {
  type: ExerciseActionTypes.SET_STEP_STATE;
  payload: Partial<StepInstance>;
  meta: { id?: StepInstance['id'] };
}

export type ExerciseAction = SetExerciseStateAction | SetStepAction;
