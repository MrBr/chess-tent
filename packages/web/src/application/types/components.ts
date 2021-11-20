import {
  Component,
  ComponentProps,
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  RefObject,
} from 'react';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Color } from '@chess-tent/chessground/dist/types';
import { LinkProps, RedirectProps, RouteProps } from 'react-router-dom';
import { Requests } from '@chess-tent/types';
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
} from '@chess-tent/models';
import {
  Move,
  NotableMove,
  Key,
  FEN,
  Piece,
  Shape,
  ExtendedKey,
  PieceRole,
  PieceRolePromotable,
  PieceColor,
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
import { ClassComponent } from './_helpers';
import { OptionsDropdownProps, ButtonProps, UI } from './ui';
import {
  AppAnalysis,
  Hooks,
  NotificationView,
  StepModules,
  Steps,
} from './index';

export interface ChessboardState {
  renderPrompt?: (close: () => void) => ReactElement;
  promotion?: {
    from: Key;
    to: Key;
    piece: Piece;
  };
}

export interface ChessboardFooterProps {
  editing: boolean;
  position: FEN;
  updateEditing: (editing: boolean) => void;
  onReset: () => void;
  onClear: () => void;
  onRotate: () => void;
  onFENSet: (FEN: FEN) => void;
  onPGN?: (position: FEN, moves: NotableMove[], headers: {}) => void;
}

export interface ChessboardProps {
  header?: ReactNode;
  footer?: ReactNode;
  evaluate?: boolean;
  size?: string | number;
  // Chessground proxy props
  viewOnly?: boolean;
  orientation?: PieceColor;
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
    promoted?: PieceRole,
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
  sparePieces?: boolean;
  editing?: boolean;
  allowAllMoves?: boolean;

  // Footer props
  onUpdateEditing?: (editing: boolean) => void;
  onReset?: (FEN: string) => void;
  onClear?: (FEN: string) => void;
  onFENSet?: (FEN: string) => void;
  onOrientationChange?: (orientation: ChessboardProps['orientation']) => void;
}

export interface ChessboardInterface
  extends Component<ChessboardProps, ChessboardState> {
  boardHost: RefObject<HTMLDivElement>;
  api: Api;
  state: ChessboardState;
  prompt: (renderPrompt: ChessboardState['renderPrompt']) => void;
  closePrompt: () => void;
  removeShape: (shape: DrawShape) => void;
  fen: (
    move?: Move,
    options?: { piece?: Piece; promoted?: PieceRolePromotable },
  ) => FEN;
  move: (from: Key, to: Key) => void;
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
  header: ReactElement;
  tabs: LessonPlaygroundTab[];
  updateStepMode: (mode: ActivityStepMode) => void;
  updateActivityStepState: (state: {}) => void;
  activeStepActivityState: ActivityStepStateBase;
  comments?: boolean;
}>;

export type LessonPlaygroundCard = FunctionComponent<{
  children: ReactNode;
  className?: string;
}>;

export type LessonToolboxText = FunctionComponent<{
  onChange?: (text: string) => void;
  defaultText?: string;
  placeholder?: string;
  className?: string;
}>;

// Move written in chess notation
export type StepMove = FunctionComponent<{
  className?: string;
  showIndex?: boolean;
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
  T extends Activity<infer U, infer K> ? { activity: T } : never
>;

export interface AnalysisSystemProps {
  analysis: Analysis<any>;
  updateAnalysis: (analysis: Analysis<any>) => void;
  initialPosition?: FEN;
  initialOrientation?: Color;
}

export interface ActivityRendererProps {
  activity: LessonActivity;
  updateActivity: ReturnType<Hooks['useDispatchService']>;
  currentStepIndex: number;
  stepsCount: number;
  activeStep: Steps;
  chapter: Chapter;
  analysis: AppAnalysis;
  lesson: Lesson;
  activityStepState: ActivityStepStateBase;
  comments?: boolean;
}

export interface ActivityRendererState {
  activeTab: number;
}

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

export type NotificationComponent<T extends Notification> = ComponentType<{
  notification: T;
}>;

export type RenderPropComponentType = ComponentType<{
  children(children: React.ReactNode): React.ReactNode;
}>;

export type Components = {
  App: ComponentType;
  MobileRoot: ComponentType;
  MobilePortal: ComponentType;
  Filters: ComponentType<{ children?: ReactElement }>;
  Header: ComponentType;
  TabBar: ComponentType;
  LoadMore: ComponentType;
  // Page with common layout setup
  Page: ComponentType;
  Layout: ComponentType<{
    className?: string;
    footer?: ReactElement | null;
    header?: ReactElement | null;
    sidebar?: ReactElement | null;
  }>;
  Chessboard: ClassComponent<ChessboardInterface>;
  ChessboardFooter: ComponentType<ChessboardFooterProps>;
  Stepper: FunctionComponent<StepperProps>;
  StepToolbox: StepToolbox;
  LessonToolboxText: LessonToolboxText;
  LessonPlayground: LessonPlayground;
  LessonPlaygroundCard: LessonPlaygroundCard;
  StepTag: StepTag;
  StepMove: StepMove;
  PieceIcon: PieceIcon;
  Router: RenderPropComponentType;
  Switch: ComponentType;
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
  Editor: ComponentType<{
    lesson: Lesson;
    save: Requests['lessonUpdates'];
    onStatusChange?: (status: LessonStatus) => void;
  }>;
  MyTrainings: ComponentType<{ trainings: LessonActivity[]; user: User }>;
  StudentTrainings: ComponentType<{ trainings: LessonActivity[]; user: User }>;
  LessonTrainings: ComponentType<{ trainings: LessonActivity[]; user: User }>;
  TrainingCard: ComponentType<{ training: LessonActivity }>;
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
    } & Pick<ComponentProps<UI['Avatar']>, 'size' | 'onClick'>
  >;
  UserSettings: ComponentType;
  Coaches: ComponentType;
  CoachCard: ComponentType<{
    coach: User;
  }>;
  Conversations: ComponentType;
  MessageButton: ComponentType<{
    size?: ButtonProps['size'];
    variant?: ButtonProps['variant'];
    text?: string;
    className?: string;
    user: User;
  }>;
  AnalysisBoard: ComponentType<AnalysisSystemProps & StepBoardComponentProps>;
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
