import { ComponentType, FunctionComponent } from 'react';
import { DrawShape } from 'chessground/draw';
import { FEN as CG_FEN, Key } from 'chessground/types';
import { schema } from 'normalizr';

export type FEN = CG_FEN;

export type StepProps<S, P = {}> = {
  step: S;
  addSection: () => void;
  addStep: () => void;
  prevPosition: FEN;
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
  | 'Actions'
  | 'Exercise';

export type StepModule<T = any> = {
  Picker: FunctionComponent;
  Editor: StepComponent<T>;
  Playground: StepComponent<T>;
  Exercise: StepComponent<T>;
  Actions: StepComponent<T>;
  type: StepType;
  createStep: (
    id: string,
    prevPosition: FEN,
    initialState?: Partial<T>,
  ) => StepInstance<T>;
  getEndSetup: (
    step: StepInstance<T>,
  ) => { position: FEN; shapes: DrawShape[] };
};

export interface StepInstance<T extends any = any> {
  id: string;
  type: StepType;
  state: T;
  schema: 'steps';
}

export type EntityState<T> = { [key: string]: T };
export interface AppState {
  trainer: {
    exercises: EntityState<Exercise>;
    sections: EntityState<Section>;
    steps: EntityState<StepInstance>;
  };
}

export type SectionChild = StepInstance | Section;
export interface Section {
  id: string;
  children: SectionChild[];
  schema: 'sections';
}

export interface Exercise {
  id: string;
  section: Section;
  activeStep: StepInstance;
  schema: 'exercises';
}

export type Move = [Key, Key];

export type Shape = DrawShape;

export interface Actions {
  shapes: DrawShape[];
  moves: Move[];
}

export type ActionPayload = DrawShape[] | Move;

export type ExercisesState = { [key: string]: Exercise };
export type SectionsState = { [key: string]: Section };
export type StepsState = { [key: string]: StepInstance };

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
