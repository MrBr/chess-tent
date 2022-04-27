import {
  Component,
  ComponentProps,
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  RefObject,
  ImgHTMLAttributes,
} from 'react';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Color } from '@chess-tent/chessground/dist/types';
import {
  LinkProps,
  RedirectProps,
  RouteProps,
  SwitchProps,
} from 'react-router-dom';
import {
  Activity,
  Analysis,
  Chapter,
  Difficulty,
  Lesson,
  Mentorship,
  Notification,
  StepRoot,
  StepType,
  Tag,
  User,
  LessonActivity,
  LessonActivityBoardState,
} from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import {
  Move,
  NotableMove,
  Key,
  FEN,
  Piece,
  Shape,
  ExtendedKey,
  PieceRolePromotable,
  Orientation,
  MoveComment,
  PGNHeaders,
  MovableColor,
  UciMove,
} from './chess';
import {
  ActivityStepStateBase,
  ActivityStepMode,
  AppStep,
  EditorProps,
  EditorSidebarProps,
  StepBoardComponentProps,
  StepModule,
  StepModuleComponentKey,
  StepSystemProps,
} from './step';
import { ClassComponent, ClassNameProps } from './_helpers';
import { OptionsDropdownProps, ButtonProps, UI } from './ui';
import {
  AppAnalysis,
  ChessboardContext,
  Hooks,
  NotificationView,
  Requests,
  StepModules,
  Steps,
} from './index';

export interface ChessboardFooterProps {
  editing: boolean;
  position: FEN;
  updateEditing: (editing: boolean) => void;
  onReset: () => void;
  onClear: () => void;
  onRotate: () => void;
  onFENSet: (FEN: FEN) => void;
  onPGN?: (
    moves: NotableMove[],
    headers: PGNHeaders,
    comments: MoveComment[],
  ) => void;
}

export interface ChessboardProps {
  header?: ReactNode;
  footer?: ReactNode;
  size?: string | number;

  // Chessground proxy props
  viewOnly?: boolean;
  orientation?: Orientation;
  selectablePieces?: boolean;
  resizable?: boolean;
  fen: FEN;
  animation?: boolean;
  onChange?: (position: FEN) => void;
  onPieceDrop?: (position: FEN, piece: Piece, key: Key) => void;
  onPieceRemove?: (position: FEN, piece: Piece, key: Key) => void;
  onMove?: (
    position: FEN,
    lastMove: Move,
    piece: Piece,
    captured: boolean,
    promoted?: PieceRolePromotable,
  ) => void;
  onShapesChange?: (shapes: DrawShape[]) => void;
  onShapeAdd?: (shape: DrawShape[]) => void;
  onShapeRemove?: (shape: DrawShape[]) => void;
  validateMove?: (orig: ExtendedKey, dest: ExtendedKey) => boolean;
  validateDrawable?: (
    newDrawShape: DrawCurrent,
    curDrawShape: DrawCurrent,
  ) => boolean;
  eraseDrawableOnClick?: boolean;
  shapes?: Shape[];
  // Used for static board shapes;
  // static in terms that user doesn't control them
  autoShapes?: Shape[];
  sparePieces?: boolean;
  editing?: boolean;
  allowAllMoves?: boolean;
  movableColor?: MovableColor;

  // Footer props
  onUpdateEditing?: (editing: boolean) => void;
  onReset?: (FEN: string) => void;
  onClear?: (FEN: string) => void;
  onFENSet?: (FEN: string) => void;
  onPGN?: (
    moves: NotableMove[],
    header: PGNHeaders,
    comments: MoveComment[],
  ) => void;
  onOrientationChange?: (orientation: ChessboardProps['orientation']) => void;
}

/**
 * Chessboard should be stateless.
 * Current step module implementation (with each step having it's own component) causes Chessboard to unmount
 * when step type changes. This primarily affect state (state gets removed).
 * Having stateless chessboard solve the issue because the state is moved to parent,
 * becoming contextual. This is useful as well so that certain board options can
 * be configured through the context as well.
 * Having chessboard state in store, making it global is somewhat ugly?!
 */
export interface ChessboardInterface extends Component<ChessboardProps> {
  boardHost: RefObject<HTMLDivElement>;
  api: Api;
  context: ChessboardContext;
  prompt: (renderPrompt: ChessboardContext['renderPrompt']) => void;
  closePrompt: () => void;
  removeShape: (shape: DrawShape) => void;
  fen: (
    move?: Move,
    options?: { piece?: Piece; promoted?: PieceRolePromotable },
  ) => FEN;
  move: (from: Key, to: Key) => void;
  syncAutoShapes: () => void;
}

export type StepperProps = {
  className?: string;
  root?: boolean;
} & StepSystemProps &
  EditorSidebarProps;

export type StepToolbox = FunctionComponent<
  {
    active?: boolean | (() => void);
    comment?: boolean | (() => void);
    exercise?: boolean | (() => void);
    remove?: boolean | (() => void);
    add?: boolean | (() => void);
    paste?: boolean | (() => void);
    textChangeHandler?: (text: string) => void;
    text?: string;
    showInput?: boolean;
    step: AppStep;
    className?: string;
    actionsClassName?: string;
    stepRoot: StepRoot;
  } & EditorProps
>;

export type LessonPlaygroundTab = {
  board: ReactElement;
  sidebar: ReactElement;
  title: string;
  mode: ActivityStepMode;
};

export type LessonPlayground = FunctionComponent<{
  board: ReactNode;
  sidebar: ReactNode;
  stepper: ReactNode;
}>;

export type LessonPlaygroundCard = FunctionComponent<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}>;

export type LessonToolboxText = FunctionComponent<{
  onChange?: (text: string) => void;
  onClick?: () => void;
  text?: string;
  placeholder?: string;
  className?: string;
}>;

// Move written in chess notation
export type StepMove = FunctionComponent<{
  className?: string;
  showIndex?: boolean;
  onClick?: (move: NotableMove) => void;
  prefix?: string | ReactElement;
  suffix?: string | ReactElement;
  blackIndexSign?: string | ReactElement;
  move: NotableMove;
}>;

export type PieceIcon = FunctionComponent<{
  className?: string;
  piece: Piece;
}>;

export type StepTag = FunctionComponent<{
  children: ReactNode;
  active: boolean;
  className?: string;
  collapse?: boolean;
  onClick?: ReactEventHandler;
}>;

export interface AuthorizedProps {
  children: ReactElement | ((authorized: boolean) => ReactElement);
}

export type ActivityComponent<T> = ComponentType<
  T extends Activity<any> ? { activity: T } : never
>;

export interface AnalysisSystemProps {
  analysis: Analysis<any>;
  updateAnalysis: <T extends any[], U>(
    service: (...args: T) => U,
  ) => (...args: T) => void;
  initialPosition?: FEN;
  initialOrientation?: Color;
}

export interface AnalysisBoardProps
  extends AnalysisSystemProps,
    StepBoardComponentProps {}

export interface ActivityBaseProps {
  activity: LessonActivity;
  updateActivity: ReturnType<Hooks['useDispatchService']>;
}

export interface ActivityDataProps<
  T extends Steps | undefined,
  K extends Chapter | undefined,
> {
  step: T;
  chapter: K;
  analysis: AppAnalysis;
  lesson: Lesson;
  activityStepState: ActivityStepStateBase;
  boardState: LessonActivityBoardState;
}

export type ActivityRendererProps<
  T extends Steps | undefined,
  K extends Chapter | undefined = Chapter | undefined,
> = T extends undefined
  ? ActivityDataProps<T, K> &
      ActivityBaseProps & {
        boards: ActivityRendererModuleBoard<Steps | undefined>[];
        cards: ActivityRendererModuleCard<Steps | undefined>[];
      }
  : ActivityDataProps<T, K> &
      ActivityBaseProps & {
        boards: ActivityRendererModuleBoard<Steps>[];
        cards: ActivityRendererModuleCard<Steps>[];
      };

export interface ActivityStepProps<T> {
  // TODO - update name to updateStepActivityState
  setStepActivityState: (state: {}) => void;
  stepActivityState: T;
  boardState: LessonActivityBoardState;
  nextStep: () => void;
  prevStep: () => void;
  completeStep: (step: AppStep) => void;
}

export interface ActivityRendererModuleProps<
  K extends Steps | undefined,
  U extends Chapter | undefined = Chapter | undefined,
  T = any,
> extends ActivityStepProps<T>,
    ActivityBaseProps,
    ActivityDataProps<K, U> {}

export interface ActivityRendererModuleBoardProps<
  T extends Steps | undefined,
  U extends Chapter | undefined = Chapter | undefined,
> extends ActivityRendererModuleProps<T, U> {
  Chessboard: ComponentType<ChessboardProps>;
}

export type ActivityRendererModuleBoard<
  T extends Steps | undefined,
  U extends Chapter | undefined = Chapter | undefined,
> = ComponentType<ActivityRendererModuleBoardProps<T, U>> & {
  mode: ActivityStepMode;
};
export type ActivityRendererModuleCard<
  T extends Steps | undefined,
  U extends Chapter | undefined = Chapter | undefined,
> = ComponentType<ActivityRendererModuleProps<T, U>>;

export interface ActivityRendererState {}

export interface TagsSelectProps {
  className?: string;
  selected?: Tag[];
  onChange?: (tags: Tag[]) => void;
}

export enum LessonStatus {
  SAVED,
  ERROR,
  DIRTY,
  INITIAL,
}

export interface Evaluation {
  score: number;
  isMate: boolean;
  variation: UciMove[];
  lineIndex: number;
  depth: number;
  position: FEN;
}

export type NotificationComponent<T extends Notification> = ComponentType<{
  notification: T;
}>;

export type RenderPropComponentType = ComponentType<{
  children(children: React.ReactNode): React.ReactNode;
}>;

export type Components = {
  ConferencingProvider: ComponentType<{ room: string }>;
  ConferencingPeer: ComponentType<{
    fromUserId: string;
    toUserId: string;
    room: string;
  }>;
  App: ComponentType;
  MobileRoot: ComponentType;
  MobilePortal: ComponentType;
  Filters: ComponentType<{ children?: ReactElement }>;
  Header: ComponentType<ClassNameProps>;
  Menu: ComponentType;
  Logo: ComponentType<ImgHTMLAttributes<HTMLImageElement>>;
  TabBar: ComponentType & {
    TabButton: ComponentType<{
      path: string;
      className?: string;
      children: ReactNode;
    }>;
  };
  LoadMore: ComponentType;
  // Page with common layout setup
  Page: ComponentType<{ header?: ReactElement; tabbar?: ReactElement }>;
  Layout: ComponentType<{
    className?: string;
    footer?: ReactElement | null;
    header?: ReactElement | null;
    menu?: ReactElement | null;
  }>;
  Chessboard: ClassComponent<ChessboardInterface>;
  ChessboardContextProvider: ComponentType;
  ChessboardFooter: ComponentType<ChessboardFooterProps>;
  Stepper: FunctionComponent<StepperProps>;
  StepToolbox: StepToolbox;
  LessonToolboxText: LessonToolboxText;
  LessonPlayground: ComponentType<{ children: ReactNode }> & {
    Board: ComponentType;
    Sidebar: ComponentType;
    Stepper: ComponentType;
  };
  LessonPlaygroundCard: LessonPlaygroundCard;
  StepTag: StepTag;
  StepMove: StepMove;
  PieceIcon: PieceIcon;
  Router: RenderPropComponentType;
  Switch: ComponentType<SwitchProps>;
  Redirect: ComponentType<RedirectProps>;
  Route: ComponentType<RouteProps>;
  AuthorizedRoute: ComponentType<
    RouteProps & { children: ReactElement; redirectRoute?: string }
  >;
  MobileRoute: ComponentType<
    RouteProps & { children: ReactElement; redirectRoute?: string }
  >;
  MobileScreen: ComponentType;

  Link: ComponentType<LinkProps & { ghost?: boolean }>;
  Back: ComponentType;
  Authorized: ComponentType<AuthorizedProps>;
  Provider: ComponentType;

  StateProvider: ComponentType;
  StepRenderer: <T extends StepModuleComponentKey, S extends AppStep>(
    props: StepModule<
      S,
      S extends AppStep<infer U, infer K> ? K : never,
      {},
      S extends AppStep<infer U, infer K>
        ? K extends StepType
          ? StepModules[K] extends StepModule<
              infer A,
              infer B,
              infer C,
              infer D
            >
            ? D
            : never
          : never
        : never
    >[T] extends ComponentType<infer P>
      ? P & { component: T; step: S }
      : never,
  ) => ReactElement;
  Evaluation: ComponentType<{
    fen: FEN;
    onMoveClick?: (moves: NotableMove[]) => void;
  }>;
  Editor: ComponentType<{
    lesson: Lesson;
    save: Requests['lessonUpdates'];
    onStatusChange?: (status: LessonStatus) => void;
  }>;
  Trainings: ComponentType<{ trainings: LessonActivity[] }>;
  ScheduledTrainings: ComponentType<{
    trainings: LessonActivity[];
  }>;
  TrainingCard: ComponentType<{ training: LessonActivity }>;
  TrainingScheduledCard: ComponentType<{ training: LessonActivity }>;
  LessonCard: ComponentType<{
    lesson: Lesson;
    owned?: boolean;
    onClick?: (lesson: Lesson) => void;
  }>;
  LessonTemplates: ComponentType<{
    lessons: RecordValue<Lesson[]>;
    onLessonClick?: (lesson: Lesson) => void;
  }>;
  LessonBrowser: ComponentType<{
    lessons: Lesson[] | null | undefined;
    onFiltersChange?: (
      search?: string,
      difficulty?: Difficulty,
      tags?: Tag[],
    ) => void;
    editable?: boolean;
    title: string;
  }>;
  LessonChapters: ComponentType<{
    chapters: Chapter[];
    activeChapter: Chapter;
    editable?: boolean;
    onChange?: (chapter: Chapter) => void;
    onEdit?: (title: string) => void;
    onNew?: () => void;
    onRemove?: (chapter: Chapter) => void;
  }>;
  UserAvatar: ComponentType<
    {
      user: User;
    } & Pick<ComponentProps<UI['Avatar']>, 'size' | 'onClick' | 'className'>
  >;
  UserSettings: ComponentType;
  Coaches: ComponentType;
  CoachCard: ComponentType<{
    coach: User;
  }>;
  ConversationsStand: ComponentType;
  AnalysisBoard: ComponentType<AnalysisBoardProps>;
  AnalysisSidebar: ComponentType<AnalysisSystemProps>;
  NotificationStand: ComponentType;
  DifficultyDropdown: ComponentType<
    Omit<OptionsDropdownProps<Difficulty>, 'values' | 'label'> & {
      includeNullOption: boolean;
    }
  >;
  TagsSelect: ComponentType<TagsSelectProps>;
  MentorshipButton: ComponentType<{ user: User; className?: string }>;
  MentorshipAction: ComponentType<{
    mentorship: Mentorship;
    approve?: boolean;
    className?: string;
    text?: string;
    size?: ButtonProps['size'];
  }>;
  NotificationRender: ComponentType<{
    notification: Notification;
    view: NotificationView;
  }>;
  NotificationsModal: ComponentType<{
    close: () => void;
  }>;
  Invitation: ComponentType;
};
