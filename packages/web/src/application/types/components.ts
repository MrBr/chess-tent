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
  KeyboardEventHandler,
} from 'react';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Color } from '@chess-tent/chessground/dist/types';
import {
  LinkProps,
  RedirectProps,
  RouteProps,
  SwitchProps,
  PromptProps,
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
  Step,
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
  MovableColor,
  UciMove,
  ChessInstance,
  PieceRole,
} from './chess';
import {
  ActivityStepStateBase,
  AppStep,
  EditorProps,
  EditorSidebarProps,
  StepBoardComponentProps,
  StepModule,
  StepModuleComponentKey,
  StepSystemProps,
} from './step';
import { ClassComponent, ClassNameProps, ClickProps } from './_helpers';
import { OptionsDropdownProps, ButtonProps, UI, UIComponent } from './ui';
import {
  ApiStatus,
  AppAnalysis,
  ChessboardContext,
  Hooks,
  NotificationView,
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
  onPGN?: (pgn: string, asChapters: boolean) => void;
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
  onPGN?: (pgn: string, asChapters: boolean) => void;
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
  chess: ChessInstance;
}

export type StepperProps = {
  className?: string;
  root?: boolean;
} & StepSystemProps &
  EditorSidebarProps;

export type StepToolbox = FunctionComponent<
  {
    active?: boolean;
    comment?: boolean | (() => void);
    exercise?: boolean | (() => void);
    remove?: boolean | (() => void);
    add?: boolean | (() => void);
    paste?: boolean | (() => void);
    step: AppStep;
    className?: string;
    actionsClassName?: string;
    stepRoot: StepRoot;
  } & EditorProps
>;
export type EditorSidebarStepContainer = FunctionComponent<
  {
    active?: boolean;
    textChangeHandler?: (text: string) => void;
    text?: string;
    showInput?: boolean;
    step: AppStep;
    className?: string;
    actionsClassName?: string;
    stepRoot: StepRoot;
    onDeleteComment?: () => void;
  } & EditorProps
>;

export type LessonPlayground = FunctionComponent<{
  board: ReactNode;
  sidebar: ReactNode;
  stepper: ReactNode;
}>;

export type LessonPlaygroundCard = FunctionComponent<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
  stretch?: boolean;
}>;

export type LessonToolboxText = FunctionComponent<{
  onChange?: (text: string) => void;
  onClick?: () => void;
  text?: string;
  placeholder?: string;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  active?: boolean;
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

export interface AnalysisBaseInterface {
  updateStep(step: Step): void;
  removeStep(step: Step): void;
  setActiveStep(step: Step): void;
  startAnalysis(
    position?: FEN,
    move?: Move,
    piece?: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ): void;
}
export interface AnalysisSystemProps {
  analysis: Analysis<any>;
  updateAnalysis: (service: (analysis: Analysis<any>) => void) => void;
  initialPosition?: FEN;
  initialOrientation?: Color;
  ref?: RefObject<AnalysisBaseInterface>;
  active: boolean;
}

export interface AnalysisBoardProps
  extends AnalysisSystemProps,
    StepBoardComponentProps {}

export interface ActivityBaseProps<T extends Steps | undefined> {
  activity: LessonActivity;
  updateActivity: ReturnType<Hooks['useDispatchService']>;
  // If chapters can't be imported then they can't be edited at all
  importChapters?: (chapters: Chapter[]) => void;
  cards: ActivityRendererModuleCard<T>[];
  actions: ActivityRendererModuleCard<T>[];
  navigation: ActivityRendererModuleCard<T>[];
  sidebar: ActivityRendererModuleCard<T>[];
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
> = ActivityDataProps<T, K> & ActivityBaseProps<T>;

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
    ActivityBaseProps<K>,
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
> = ComponentType<ActivityRendererModuleBoardProps<T, U>>;

export type ActivityRendererModuleCard<
  T extends Steps | undefined,
  U extends Chapter | undefined = Chapter | undefined,
> = ComponentType<ActivityRendererModuleProps<T, U>>;

export interface ActivityRendererState {
  error?: boolean;
}

export interface TagsSelectProps {
  className?: string;
  selected?: Tag[];
  onChange?: (tags: Tag[]) => void;
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
  Search: ComponentType<ClassNameProps>;
  ConferencingPeer: ComponentType<{
    fromUserId: string;
    toUserId: string;
    room: string;
    polite: boolean;
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
      path?: string;
      className?: string;
      children: ReactNode;
    }>;
  };
  ApiStatusLabel: ComponentType<{ status: ApiStatus }>;
  ApiRedirectPrompt: ComponentType<{ status: ApiStatus }>;
  LoadMore: ComponentType;
  // Page with common layout setup
  Page: ComponentType<{ header?: ReactElement; tabbar?: ReactElement }> & {
    Body: UIComponent;
  };
  Layout: ComponentType<{
    className?: string;
    footer?: ReactElement | null;
    header?: ReactElement | null;
    menu?: ReactElement | null;
  }>;
  Chessboard: ClassComponent<ChessboardInterface>;
  ChessboardPreview: FunctionComponent<{ fen: FEN }>;
  ChessboardContextProvider: ComponentType;
  ChessboardFooter: ComponentType<ChessboardFooterProps>;
  Stepper: FunctionComponent<StepperProps>;
  StepToolbox: StepToolbox;
  EditorSidebarStepContainer: EditorSidebarStepContainer;
  DifficultyLabel: ComponentType<{ difficulty: RecordValue<Difficulty> }>;
  Tags: ComponentType<
    { tags: RecordValue<Tag[]>; inline?: boolean } & ClassNameProps
  >;
  LessonToolboxText: LessonToolboxText;
  LessonPlayground: ComponentType<{ children: ReactNode }> & {
    Board: ComponentType;
    Actions: ComponentType;
    Navigation: ComponentType;
    Cardbar: ComponentType;
    Sidebar: ComponentType;
  };
  LessonPlaygroundCard: LessonPlaygroundCard;
  StepTag: StepTag;
  LessonPlaygroundStepTag: ComponentType<
    {
      children?: ReactNode;
      active?: boolean;
      visited?: boolean;
      completed?: boolean;
    } & ClickProps &
      ClassNameProps
  >;
  StepMove: StepMove;
  PieceIcon: PieceIcon;
  Router: RenderPropComponentType;
  Switch: ComponentType<SwitchProps>;
  Redirect: ComponentType<RedirectProps>;
  Route: ComponentType<RouteProps>;
  RedirectPrompt: ComponentType<PromptProps>;
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
    onMoveClick?: (moves: NotableMove[]) => void;
  }>;
  Editor: ComponentType<{
    lesson: Lesson;
    lessonStatus: ApiStatus;
  }>;
  Trainings: ComponentType<{
    trainings: RecordValue<LessonActivity[]>;
    onTrainingClick: (training: LessonActivity) => void;
  }>;
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
    onLessonClick: (lesson: Lesson) => void;
  }>;
  LessonChapters: ComponentType<{
    chapters: Chapter[];
    activeChapter: Chapter;
    editable?: boolean;
    onChange?: (chapter: Chapter) => void;
    onEdit?: (title: string) => void;
    onNew?: () => void;
    onRemove?: (chapter: Chapter) => void;
    onImport?: () => void;
    onMove?: (up?: boolean) => void;
  }>;
  UserAvatar: ComponentType<
    {
      user: User;
    } & Pick<ComponentProps<UI['Avatar']>, 'size' | 'onClick' | 'className'>
  >;
  UserSettings: ComponentType<{ label?: ReactNode }>;
  Coaches: ComponentType<{ preview?: boolean }>;
  CoachCard: ComponentType<{
    coach: User;
  }>;
  ConversationsStand: ComponentType;
  AnalysisBoard: ComponentType<AnalysisBoardProps>;
  AnalysisSidebar: ComponentType<AnalysisSystemProps>;
  NotificationStand: ComponentType;
  NotificationStandItem: ComponentType<{
    onClick: () => void;
    title: string;
    subtitle: string;
  }>;
  DifficultyDropdown: ComponentType<
    Omit<OptionsDropdownProps<Difficulty>, 'values' | 'label'> & {
      includeNullOption: boolean;
    }
  >;
  TagsSelect: ComponentType<TagsSelectProps>;
  MentorshipButton: ComponentType<{
    user: User;
    className?: string;
    textual?: boolean;
  }>;
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
  Share: ComponentType<{
    title: string;
    link: string;
    description: string;
    close: () => void;
  }>;
};
