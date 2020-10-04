import {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactEventHandler,
} from 'react';
import {
  Reducer,
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
} from 'redux';
import { BatchAction } from 'redux-batched-actions';
import { register } from 'core-module';
import {
  Activity,
  Chapter,
  Conversation,
  Entity,
  Lesson,
  Message,
  Step,
  StepType,
  Subject,
  User,
} from '@chess-tent/models';
import {
  RouteProps,
  RedirectProps,
  LinkProps,
  useParams,
  useLocation,
} from 'react-router-dom';
import { Store } from 'redux';
import { History } from 'history';
import { useSelector, useDispatch } from 'react-redux';
import {
  API,
  RequestFetch,
  ApiMethods,
  Requests,
  StatusResponse,
  SendMessageAction,
  AppState,
  SetLessonActiveStepAction,
  UpdateEntitiesAction,
  RecordValue,
  UpdateActivityStateAction,
  UpdateActivityAction,
  SetActivityActiveStepAction,
  UpdateLessonStepAction,
} from '@chess-tent/types';
import { ChessInstance } from 'chess.js';
import { FEN, Move, Piece, PieceColor } from './chess';
import { StepModule, StepModuleComponentKey } from './step';
import {
  AuthorizedProps,
  ChessboardInterface,
  LessonToolboxText,
  StepperProps,
  StepTag,
  StepToolbox,
  StepMove,
  LessonPlayground,
} from './components';
import { ClassComponent, GenericArguments } from './_helpers';
import { UI } from './ui';
import {
  DescriptionModule,
  ExerciseModule,
  MoveModule,
  Steps,
  VariationModule,
} from './steps';
import { Socket } from './socket';
import { HOC } from './hoc';

export * from '@chess-tent/types';
export * from './activity';
export * from './hoc';
export * from './chess';
export * from './step';
export * from './steps';
export * from './components';
export * from './ui';
export * from './socket';
export * from './_helpers';

// Hooks
export type RecordHookReturn<T extends RecordValue> = [
  T | null,
  (value: T, meta?: {}) => void,
  () => void,
];

export type Hooks = {
  useComponentStateSilent: () => { mounted: boolean };
  useComponentState: () => { mounted: boolean };
  usePromptModal: () => (
    renderModal: (close: () => void) => ReactElement,
  ) => void;
  useUpdateLessonStepState: <T extends Step>(
    updateStep: (step: T) => void,
    step: T,
  ) => (state: Partial<T['state']>) => void;
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useDispatch: typeof useDispatch;
  useSelector: typeof useSelector;
  useUser: (userId: User['id']) => User;
  useActiveUserRecord: () => RecordHookReturn<User>;
  useUserActivitiesRecord: (user: User) => RecordHookReturn<Activity[]>;
  useUserLessonsRecord: (user: User) => RecordHookReturn<Lesson[]>;
  useConversationParticipant: () => RecordHookReturn<User>;
  useHistory: () => History;
  useLocation: typeof useLocation;
  useParams: typeof useParams;
  useApi: <T, K extends StatusResponse>(
    request: RequestFetch<T, K>,
  ) => {
    fetch: (...args: GenericArguments<T>) => void;
    response: K | null;
    loading: boolean;
    error: null | string | {};
    reset: () => void;
  };
  useRecord: <T extends RecordValue>(recordKey: string) => RecordHookReturn<T>;
  useDenormalize: <T extends RecordValue>(
    descriptor: string[] | string | null,
    type?: string,
  ) => T | null;
};

// Application Components
type ModuleRecord<K extends keyof any, T extends StepModule> = {
  [P in K]: T extends StepModule<infer U, infer S>
    ? S extends P
      ? T
      : never
    : never;
};
export type StepModules = ModuleRecord<
  StepType,
  MoveModule | VariationModule | DescriptionModule | ExerciseModule
>;

export interface Schema {
  type: string;
  relationships: {
    [key: string]: string | {};
  };
}
export type Model = {
  lessonSchema: Schema;
  activitySchema: Schema;
  stepSchema: Schema;
  conversationSchema: Schema;
  messageSchema: Schema;
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
      lessonId: Lesson['id'],
      step: Step,
    ) => SetLessonActiveStepAction;
    updateActivityState: <T extends Activity>(
      activity: T,
      state: Partial<T extends Activity<infer K, infer S> ? S : never>,
    ) => UpdateActivityStateAction;
    setActivityActiveStep: (
      activity: Activity,
      step: Step,
    ) => SetActivityActiveStepAction;
    updateActivity: <T extends Activity>(
      activity: T,
      patch: Partial<T>,
    ) => UpdateActivityAction<T extends Activity<infer S> ? S : never>;
    sendMessage: (
      user: User,
      conversation: Conversation,
      message: Message,
    ) => SendMessageAction;
    updateLessonStep: <T extends Step>(
      lesson: Lesson,
      chapter: Chapter,
      step: T,
    ) => UpdateLessonStepAction;
    updateLessonStepState: <T extends Step>(
      lesson: Lesson,
      chapter: Chapter,
      step: T,
      state: Partial<T['state']>,
    ) => UpdateLessonStepAction;
  };
  selectors: {
    lessonSelector: (
      lessonId: Lesson['id'],
    ) => (state: AppState) => Lesson | null;
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
  denormalize: (id: string, type: string, entities: {}) => any;
  normalize: (entity: Entity) => any;
};

export type Services = {
  Chess: {
    new (fen?: string): ChessInstance;
  };
  createFenForward: (fen: FEN, moves: Move[]) => FEN;
  createFenBackward: (fen: FEN, moves: Move[]) => FEN;
  getPiece: (position: FEN, square: string) => Piece | null;
  getTurnColor: (position: FEN) => PieceColor;
  setTurnColor: (position: FEN, color: PieceColor) => FEN;

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
  createRecordHook: <T extends RecordValue>(
    recordKey: string,
  ) => () => RecordHookReturn<T>;
  isStepType: <T extends Steps>(step: Step, stepType: StepType) => step is T;
  createStep: <T extends Steps>(
    stepType: T extends Step<infer U, infer K> ? K : never,
    initialPosition: FEN,
    initialState?: Partial<T extends Step<infer U, infer K> ? U : never>,
  ) => T;
  history: History;
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
  Layout: ComponentType<{ className?: string }>;
  Chessboard: ClassComponent<ChessboardInterface>;
  Stepper: FunctionComponent<StepperProps>;
  StepperStepContainer: ComponentType<{ onClick?: ReactEventHandler }>;
  StepToolbox: StepToolbox;
  LessonToolboxText: LessonToolboxText;
  LessonPlayground: LessonPlayground;
  StepTag: StepTag;
  StepMove: StepMove;
  Router: ComponentType;
  Switch: ComponentType;
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
  Editor: ComponentType<{ lesson: Lesson; save: Requests['lessonUpdates'] }>;
  Lessons: ComponentType<{ lessons: Lesson[] | null }>;
  Coaches: ComponentType;
  Activities: ComponentType<{ activities: Activity[] | null }>;
  Conversations: ComponentType;
};

export type Constants = {
  START_FEN: FEN;
};

export type Application = {
  services: Services;
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
  socket: Socket;
  model: Model;
  stepModules: StepModules;
  hoc: HOC;
};
