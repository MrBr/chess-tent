import {
  Component,
  FunctionComponent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Chapter, Lesson, Step } from '@chess-tent/models';
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
import { EditorProps, StepSystemProps } from './step';

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
  width?: string | number;
  height?: string | number;
  // Chessground proxy props
  viewOnly?: boolean;
  selectablePieces?: boolean;
  resizable?: boolean;
  fen: FEN;
  animation?: boolean;
  onChange?: (position: FEN) => void;
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
  steps: Step[];
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
  board: ReactElement;
  sidebar: ReactElement;
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

export interface ActionProps {
  onClick?: () => void;
}

export interface AuthorizedProps {
  children: ReactElement | ((authorized: boolean) => ReactElement);
}

export interface LessonPlaygroundSidebarProps {
  lesson: Lesson;
  chapter: Chapter;
  step: Step;
}
