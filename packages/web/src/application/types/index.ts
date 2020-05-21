import { ComponentType } from 'react';
import { Reducer, Action as ReduxAction } from 'redux';
import { BatchAction } from 'redux-batched-actions';
import { Schema } from 'normalizr';
import { Exercise, Section, SectionChild, Step } from '@chess-tent/models';
import {
  AddSectionChildAction,
  AppState,
  RemoveSectionChildAction,
  SetExerciseActiveStepAction,
  UpdateEntitiesAction,
  UpdateStepAction,
  UpdateStepStateAction,
} from './state';
import { FEN, Move } from './chess';
import {
  StepEndSetup,
  StepMap,
  StepModule,
  StepModuleComponentKey,
  StepProps,
} from './step';

export * from './state';
export * from './chess';
export * from './step';

// Hooks
export type Hooks = {
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
};

// Application Components

export type StepModules = {
  registerStep: (stepModule: StepModule) => void;
  getStepModule: <T extends keyof StepMap>(type: T) => StepModule<Step, T>;
  createStep: (
    stepType: keyof StepMap,
    ...args: Parameters<StepModule<Step, keyof StepMap>['createStep']>
  ) => Step;
  getStepEndSetup: (step: Step) => StepEndSetup;
};

export type Model = {
  exerciseSchema: Schema;
  sectionSchema: Schema;
  stepSchema: Schema;
};

export type State = {
  registerEntityReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  getRootReducer: () => Reducer;
  actions: {
    updateEntities: (entity: Exercise | Section | Step) => UpdateEntitiesAction;
    setExerciseActiveStep: (
      exercise: Exercise,
      step: Step,
    ) => SetExerciseActiveStepAction;
    updateStep: (step: Step, patch: Partial<Step>) => UpdateStepAction;
    updateStepState: (step: Step, state: any) => UpdateStepStateAction;
    addSectionChild: (
      section: Section,
      child: SectionChild,
    ) => AddSectionChildAction;
    removeSectionChild: (
      section: Section,
      child: SectionChild,
    ) => RemoveSectionChildAction;
  };
  selectors: {
    exerciseSelector: (
      exerciseId: Exercise['id'],
    ) => (state: AppState) => Exercise;
    stepSelector: (stepId: Step['id']) => (state: AppState) => Step;
  };
};
export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
};

export type Services = {
  Chess: {
    new (fen?: string): {};
  };
  recreateFenWithMoves: (fen: FEN, moves: Move[]) => FEN;
};

export type Components = {
  Chessboard: any; // TODO
  Stepper: any; // TODO
  Action: any; // TODO
  StepRenderer: ComponentType<
    StepProps<
      Step,
      {
        component: StepModuleComponentKey;
      }
    >
  >;
  Evaluator: ComponentType<{
    position: FEN;
    evaluate?: boolean;
    depth?: number;
    // Evaluator is making sure that updates are thrown for the latest position only
    onEvaluationChange?: (
      score: string,
      isMate: boolean,
      variation: Move[],
      depth: number,
    ) => void;
    // Best move is not reliable in sense that
    // after position changed it can still provide best move for the previous position
    onBestMoveChange?: (bestMove: Move, ponder?: Move) => void;
  }>;
  Exercise: ComponentType;
};

export type UI = any;

export type Constants = {
  START_FEN: FEN;
};

export type Application = {
  services: Services;
  register: (
    checkDependencies: () => any[] | void,
    cb?: Function,
  ) => void | number;
  resolveDeferredRegister: Function;
  ui: UI;
  components: Components;
  constants: Constants;
  hooks: Hooks;
  state: State;
  utils: Utils;
  model: Model;
  stepModules: StepModules;
};
