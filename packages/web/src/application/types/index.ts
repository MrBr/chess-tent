import { ComponentType, FunctionComponent } from 'react';
import { Reducer, Action as ReduxAction } from 'redux';
import { BatchAction } from 'redux-batched-actions';
import { Schema } from 'normalizr';
import { register } from 'core-module';
import { Lesson, Section, SectionChild, Step, User } from '@chess-tent/models';
import { RouteProps, RedirectProps } from 'react-router-dom';
import { Store } from 'redux';
import {
  AddSectionChildAction,
  AppState,
  RemoveSectionChildAction,
  SetLessonActiveStepAction,
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
import {
  ActionProps,
  AuthorizedProps,
  ChessboardInterface,
  StepperProps,
} from './components';
import { ClassComponent } from './_helpers';
import { UI } from './ui';

export * from './state';
export * from './chess';
export * from './step';
export * from './components';
export * from './ui';

// Hooks
export type Hooks = {
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useUser: (userId: User['id']) => User;
  useActiveUser: () => User | null;
  useApi: <T, K>(
    request: (data?: T) => Promise<K>,
  ) => {
    fetch: (data?: T) => void;
    response: K | null;
    loading: boolean;
    error: null | string | {};
  };
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
  lessonSchema: Schema;
  sectionSchema: Schema;
  stepSchema: Schema;
  userSchema: Schema;
};

export type State = {
  store: Store;
  registerReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerEntityReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  getRootReducer: () => Reducer;
  actions: {
    updateEntities: (entity: Lesson | Section | Step) => UpdateEntitiesAction;
    setLessonActiveStep: (
      lesson: Lesson,
      step: Step,
    ) => SetLessonActiveStepAction;
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
    lessonSelector: (lessonId: Lesson['id']) => (state: AppState) => Lesson;
    stepSelector: (stepId: Step['id']) => (state: AppState) => Step;
  };
};

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
};

export type StatusResponse = { error: string | null };

export type ApiMethods = 'GET' | 'POST';
export interface API {
  basePath: string;
  createRequest: <T, U>(
    request: { url: string; method: ApiMethods; data?: T },
    token?: string,
  ) => Promise<U>;
}

export type Services = {
  Chess: {
    new (fen?: string): {};
  };
  recreateFenWithMoves: (fen: FEN, moves: Move[]) => FEN;
  addRoute: (route: ComponentType) => void;
  api: API;
  createRequest: <K, U>(
    url: string,
    method: ApiMethods,
  ) => (data?: K) => Promise<U>;
  saveToken: (token: string) => void;
  getToken: () => string;
};

export interface Request<T> {
  url: string;
  method: ApiMethods;
  data?: T;
}
export type RequestFetch<T, U> = (data?: T) => Promise<U>;

export type Requests = {
  register: RequestFetch<Partial<User>, StatusResponse>;
};

export type Pages = {
  Landing: ComponentType;
  Dashboard: ComponentType;
  Register: ComponentType;
  Home: ComponentType;
};

export type Components = {
  App: ComponentType;
  Chessboard: ClassComponent<ChessboardInterface>;
  Stepper: FunctionComponent<StepperProps>;
  Action: FunctionComponent<ActionProps>;
  Router: ComponentType;
  Redirect: ComponentType<RedirectProps>;
  Route: ComponentType<RouteProps>;
  Authorized: ComponentType<AuthorizedProps>;
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
  Lesson: ComponentType;
};

export type Constants = {
  START_FEN: FEN;
};

export type Application = {
  services: Services;
  test: () => string;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
  ui: UI;
  pages: Pages;
  components: Components;
  requests: Requests;
  constants: Constants;
  hooks: Hooks;
  state: State;
  utils: Utils;
  model: Model;
  stepModules: StepModules;
};