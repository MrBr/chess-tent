import { ComponentType, FunctionComponent } from 'react';
import {
  Reducer,
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
} from 'redux';
import { BatchAction } from 'redux-batched-actions';
import { Schema } from 'normalizr';
import { register } from 'core-module';
import { Lesson, Step, User } from '@chess-tent/models';
import {
  RouteProps,
  RedirectProps,
  LinkProps,
  useParams,
} from 'react-router-dom';
import { Store } from 'redux';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppState,
  SetLessonActiveStepAction,
  UpdateEntitiesAction,
  UpdateStepAction,
  UpdateStepStateAction,
} from './state';
import { FEN, Move, Piece } from './chess';
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

export type GenericArguments<T> = T extends [] ? T : T extends void ? [] : [T];

// Hooks
export type Hooks = {
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useDispatch: typeof useDispatch;
  useSelector: typeof useSelector;
  useUser: (userId: User['id']) => User;
  useActiveUser: () => User | null;
  useHistory: () => History;
  useParams: typeof useParams;
  useApi: <T, K>(
    request: RequestFetch<T, K>,
  ) => {
    fetch: (...args: GenericArguments<T>) => void;
    response: K | null;
    loading: boolean;
    error: null | string | {};
  };
};

// Application Components

export type StepModules = {
  registerStep: (stepModule: StepModule) => void;
  getStepModule: <T extends keyof StepMap>(type: T) => StepModule<Step, T>;
  createStep: <T extends Step>(
    stepType: keyof StepMap,
    initialPosition: FEN,
    initialState?: T extends Step<infer U, infer K> ? U : never,
  ) => Step;
  getStepEndSetup: (step: Step) => StepEndSetup;
};

export type Model = {
  lessonSchema: Schema;
  sectionSchema: Schema;
  stepSchema: Schema;
  userSchema: Schema;
};
export type Middleware = ReduxMiddleware;

export type State = {
  store: Store;
  middleware: Middleware[];
  registerReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerEntityReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerMiddleware: (middleware: Middleware) => void;
  getRootReducer: () => Reducer;
  actions: {
    updateEntities: (entity: Lesson | Step | User) => UpdateEntitiesAction;
    setLessonActiveStep: (
      lesson: Lesson,
      step: Step,
    ) => SetLessonActiveStepAction;
    updateStep: (step: Step, patch: Partial<Step>) => UpdateStepAction;
    updateStepState: (step: Step, state: any) => UpdateStepStateAction;
  };
  selectors: {
    lessonSelector: (lessonId: Lesson['id']) => (state: AppState) => Lesson;
    stepSelector: (stepId: Step['id']) => (state: AppState) => Step;
  };
};

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
  generateIndex: () => string;
};

export type StatusResponse = { error: string | null };
export type DataResponse<T> = { data: T } & StatusResponse;
export type UserResponse = DataResponse<User>;
export type LessonResponse = DataResponse<Lesson>;

export type ApiMethods = 'GET' | 'POST';
export interface API {
  basePath: string;
  makeRequest: <T, U>(request: {
    url: string;
    method: ApiMethods;
    data?: T;
  }) => Promise<U>;
}

export type Services = {
  Chess: {
    new (fen?: string): {};
  };
  recreateFenWithMoves: (fen: FEN, moves: Move[]) => FEN;
  getPiece: (position: FEN, square: string) => Piece | null;

  // Add non infrastructural providers
  // Allow modules to inject their own non dependant Providers
  addProvider: (provider: ComponentType) => void;
  addRoute: (route: ComponentType) => void;
  api: API;
  createRequest: <K, U>(
    method: ApiMethods,
    urlOrCustomizer:
      | string
      | ((...args: GenericArguments<K>) => { url: string; data?: any }),
  ) => (...args: GenericArguments<K>) => Promise<U>;
};

export interface Request<T> {
  url: string;
  method: ApiMethods;
  data?: T;
}
export type RequestFetch<T, U> = (...args: GenericArguments<T>) => Promise<U>;

export type Requests = {
  register: RequestFetch<Partial<User>, StatusResponse>;
  login: RequestFetch<Pick<User, 'email' | 'password'>, UserResponse>;
  me: RequestFetch<undefined, UserResponse>;
  lesson: RequestFetch<[string], LessonResponse>;
};

export type Pages = {
  Landing: ComponentType;
  Dashboard: ComponentType;
  Register: ComponentType;
  Home: ComponentType;
};

export type Components = {
  App: ComponentType;
  Header: ComponentType;
  Chessboard: ClassComponent<ChessboardInterface>;
  Stepper: FunctionComponent<StepperProps>;
  Action: FunctionComponent<ActionProps>;
  Router: ComponentType;
  Redirect: ComponentType<RedirectProps>;
  Route: ComponentType<RouteProps>;
  Link: ComponentType<LinkProps>;
  Authorized: ComponentType<AuthorizedProps>;
  Provider: ComponentType;
  StateProvider: ComponentType;
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
  Editor: ComponentType<{ lesson: Lesson }>;
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
