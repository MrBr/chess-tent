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
  Step,
  StepType,
  Tag,
  User,
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
} from './chess';
import {
  EditorProps,
  StepBoardComponentProps,
  StepModule,
  StepModuleComponentKey,
  StepSystemProps,
} from './step';
import { ClassComponent } from './_helpers';
import { OptionsDropdownProps, ButtonProps, UI } from './ui';
import { LessonActivity, NotificationView, StepModules, Steps } from './index';

export interface ChessboardState {
  renderPrompt?: (close: () => void) => ReactElement;
  promotion?: {
    from: Key;
    to: Key;
    piece: Piece;
  };
}

export interface ChessboardProps {
  header?: ReactNode;
  footer?: ReactNode;
  onReset?: Function;
  evaluate?: boolean;
  size?: string | number;
  // Chessground proxy props
  viewOnly?: boolean;
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
  edit?: boolean;
}

export interface ChessboardInterface
  extends Component<ChessboardProps, ChessboardState> {
  boardHost: RefObject<HTMLDivElement>;
  api: Api;
  state: ChessboardState;
  prompt: (renderPrompt: ChessboardState['renderPrompt']) => void;
  closePrompt: () => void;
  removeShape: (shape: DrawShape) => void;
  resetBoard: () => void;
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
  EditorProps;

export type StepToolbox = FunctionComponent<{
  active: boolean;
  addStepHandler?: () => void;
  addExerciseHandler?: () => void;
  deleteStepHandler?: () => void;
  textChangeHandler?: (text: string) => void;
  text?: string;
  showInput?: boolean;
}>;

export type LessonPlayground = FunctionComponent<{
  header: ReactElement;
  tabs: { board: ReactElement; sidebar: ReactElement; title: string }[];
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
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

export type StepTag = FunctionComponent<{
  children: ReactNode;
  active: boolean;
  step: Step;
  className?: string;
  move?: NotableMove | null;
}>;

export interface AuthorizedProps {
  children: ReactElement | ((authorized: boolean) => ReactElement);
}

export interface LessonPlaygroundSidebarProps {
  header?: ReactElement;
}

export type ActivityComponent<T> = ComponentType<
  T extends Activity<infer U, infer K> ? { activity: T } : never
>;

export interface AnalysisSystemProps {
  analysis: Analysis;
  updateAnalysis: (analysis: Analysis) => void;
}

export interface ActivityRendererProps {
  activity: LessonActivity;
  updateActivity: (activity: LessonActivity) => void;
  updateActivityStepState: (
    activity: LessonActivity,
    step: Step,
    state: {},
  ) => void;
  currentStepIndex: number;
  stepsCount: number;
  activeStep: Steps;
  chapter: Chapter;
  analysis: Analysis;
  lesson: Lesson;
  activityStepState: {};
}

export interface ActivityRendererState {
  activeTab: number;
}

export interface TagsSelectProps {
  className?: string;
  tags: Tag[];
  selected?: Tag[];
  onChange?: (tags: Tag['id'][]) => void;
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
  LessonPlaygroundSidebar: ComponentType<LessonPlaygroundSidebarProps>;
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
  StepRenderer: <T extends StepModuleComponentKey, S extends Step>(
    props: StepModule<
      S,
      S extends Step<infer U, infer K> ? K : never,
      {},
      S extends Step<infer U, infer K>
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
  Lessons: ComponentType<{ lessons: Lesson[] | null }>;
  Trainings: ComponentType<{ user: User }>;
  LessonChapters: ComponentType<{
    chapters: Chapter[];
    activeChapter: Chapter;
    editable?: boolean;
    onChange?: (chapter: Chapter) => void;
    onEdit?: (title: string) => void;
    onNew?: () => void;
    onRemove?: (chapter: Chapter) => void;
  }>;
  EditBoardToggle: ComponentType<{
    editing: boolean;
    onChange: (editing: boolean) => void;
  }>;
  UserAvatar: ComponentType<
    {
      user: User;
    } & Pick<ComponentProps<UI['Avatar']>, 'size' | 'onClick'>
  >;
  Coaches: ComponentType;
  CoachCard: ComponentType<{
    coach: User;
  }>;
  Activities: ComponentType<{ activities: Activity[] | null }>;
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
  MentorshipButton: ComponentType<{ user: User }>;
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
};
