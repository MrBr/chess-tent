import { ComponentType, FunctionComponent, ReactElement } from 'react';
import {
  Reducer,
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
} from 'redux';
import { BatchAction } from 'redux-batched-actions';
import { Schema } from 'normalizr';
import { register } from 'core-module';
import {
  Activity,
  Entity,
  Lesson,
  Step,
  Subject,
  User,
} from '@chess-tent/models';
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
  RecordValue,
  UpdateActivityStateAction,
  UpdateActivityAction,
} from './state';
import { FEN, Move, Piece } from './chess';
import {
  StepEndSetup,
  StepMap,
  StepModule,
  StepModuleComponentKey,
} from './step';
import {
  ActionProps,
  AuthorizedProps,
  ChessboardInterface,
  StepperProps,
} from './components';
import { ClassComponent, GenericArguments } from './_helpers';
import { UI } from './ui';
import { API, RequestFetch, ApiMethods, Requests } from './api';

export * from './activity';
export * from './state';
export * from './chess';
export * from './step';
export * from './components';
export * from './ui';
export * from './api';
export * from './_helpers';

// Hooks
export type RecordHookReturn<T extends RecordValue> = [
  T | null,
  (value: T, meta?: {}) => void,
  () => void,
];
export type Hooks = {
  useComponentStateSilent: () => { mounted: boolean };
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useDispatch: typeof useDispatch;
  useSelector: typeof useSelector;
  useUser: (userId: User['id']) => User;
  useActiveUserRecord: () => RecordHookReturn<User>;
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
  useRecord: <T extends RecordValue>(recordKey: string) => RecordHookReturn<T>;
  useDenormalize: <T extends RecordValue>(
    descriptor: string[] | string | null,
    type?: string,
  ) => T | null;
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
  activitySchema: Schema;
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
    updateEntities: (entity: Entity | Entity[]) => UpdateEntitiesAction;
    setLessonActiveStep: (
      lesson: Lesson,
      step: Step,
    ) => SetLessonActiveStepAction;
    updateStep: (step: Step, patch: Partial<Step>) => UpdateStepAction;
    updateStepState: (step: Step, state: any) => UpdateStepStateAction;
    updateActivityState: (
      activity: Activity<Subject>,
      state: {},
    ) => UpdateActivityStateAction;
    updateActivity: <T extends Subject>(
      activity: Activity<T>,
      ppatch: Partial<Activity<T>>,
    ) => UpdateActivityAction<T>;
  };
  selectors: {
    lessonSelector: (lessonId: Lesson['id']) => (state: AppState) => Lesson;
    stepSelector: (stepId: Step['id']) => (state: AppState) => Step;
    activitySelector: <T extends Subject>(
      activityId: Activity<T>['id'],
    ) => (state: AppState) => Activity<T>;
  };
};

export type Utils = {
  getEntitySchema: (entity: unknown) => Schema;
  getTypeSchema: (type: string) => Schema;
  rightMouse: (f: Function) => (e: MouseEvent) => void;
  generateIndex: () => string;
};

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
  createRecordHook: <T extends Entity>(
    recordKey: string,
  ) => () => RecordHookReturn<T>;
};

export type Pages = {
  Landing: ComponentType;
  Dashboard: ComponentType;
  Register: ComponentType;
  Home: ComponentType;
};

export type ActivityComponent<T> = ComponentType<
  T extends Activity<infer U, infer K> ? { activity: T } : never
>;

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
  StepRenderer: <T extends StepModuleComponentKey>(
    props: StepModule[T] extends ComponentType<infer P>
      ? P & { component: StepModuleComponentKey; step: Step }
      : never,
  ) => ReactElement;
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
  Lessons: ComponentType<{ owner: User }>;
  Activities: ComponentType<{ owner: User }>;
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
