import { ComponentType, FunctionComponent } from 'react';
import { DrawShape } from 'chessground/draw';
import { FEN as CG_FEN, Key as CG_KEY } from 'chessground/types';
import { schema } from 'normalizr';
import { StepModuleType } from './modules';

export type FEN = CG_FEN;

export type StepSystemProps = {
  addSection: (children?: Section['children']) => void;
  addStep: () => void;
  prevPosition: FEN;
};
export type StepProps<S, P = {}> = {
  step: S;
} & StepSystemProps &
  P;

export type StepComponent<S> = ComponentType<StepProps<S>>;

export type StepModuleComponentKey =
  | 'Editor'
  | 'Picker'
  | 'Playground'
  | 'Actions'
  | 'Exercise';

export type GetStep<T> = T extends StepModule<infer U, infer K> ? U : never;
export type Steps = GetStep<StepModuleType>;
export type GetStepModule<A, T> = A extends { type: T } ? A : never;
export type GetStepFromSteps<A, T> = A extends { type: T } ? A : never;

export type StepModule<T, K> = {
  Picker: FunctionComponent;
  Editor: StepComponent<T>;
  Playground: StepComponent<T>;
  Exercise: StepComponent<T>;
  Actions: StepComponent<T>;
  type: K;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T extends Step<infer S, K> ? S : never>,
  ) => T;
  getEndSetup: (step: T) => { position: FEN; shapes: DrawShape[] };
};

export type EntityState<T> = { [key: string]: T };

export interface Step<T, K> {
  schema: 'steps';
  id: string;
  type: K;
  state: T;
}

export type SectionChild = Steps | Section;
export interface Section {
  id: string;
  children: SectionChild[];
  schema: 'sections';
}

export interface Exercise {
  id: string;
  section: Section;
  activeStep: Steps;
  schema: 'exercises';
}

export type Key = CG_KEY;
export type Move = [Key, Key];

export type Shape = DrawShape;

export type ExercisesState = { [key: string]: Exercise };
export type SectionsState = { [key: string]: Section };
export type StepsState = { [key: string]: Steps };
export interface AppState {
  trainer: {
    exercises: ExercisesState;
    sections: SectionsState;
    steps: StepsState;
  };
}

export const stepSchema = new schema.Entity('steps');

export const sectionSchema = new schema.Entity('sections');
export const sectionChildrenSchema = new schema.Array(
  {
    sections: sectionSchema,
    steps: stepSchema,
  },
  value => value.schema,
);
sectionSchema.define({ children: sectionChildrenSchema });

export const exerciseSchema = new schema.Entity('exercises', {
  section: sectionSchema,
  activeStep: stepSchema,
});
export type Action<T, P, M = {}> = {
  type: T;
  payload: P;
  meta: M;
};
