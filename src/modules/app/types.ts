import { ComponentType, FunctionComponent } from 'react';
import { DrawShape } from 'chessground/draw';
import { Key } from 'chessground/types';
import { schema } from 'normalizr';

export type StepProps<S, P = {}> = {
  step: S;
  addSection: () => void;
  addStep: () => void;
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

export type StepModule = {
  Picker: FunctionComponent;
  Editor: StepComponent<any>;
  Playground: StepComponent<any>;
  Exercise: StepComponent<any>;
  Actions: StepComponent<any>;
  type: StepType;
  getInitialState: () => {};
};

export interface StepInstance<T extends {} = {}> {
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

export interface Section {
  id: string;
  children: (StepInstance | Section)[];
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
