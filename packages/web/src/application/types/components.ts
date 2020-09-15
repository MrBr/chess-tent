import {
  Component,
  FunctionComponent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Step } from '@chess-tent/models';
import {
  Move,
  NotableMove,
  Key,
  FEN,
  Piece,
  Shape,
  ExtendedKey,
} from './chess';
import { StepSystemProps } from './step';

export interface ChessboardState {
  renderPrompt?: (close: () => void) => ReactElement;
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
  onChange?: (position: FEN, lastMove?: Move, piece?: Piece) => void;
  onMove?: (
    position: FEN,
    lastMove: Move,
    piece: Piece,
    captured: boolean,
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
  fen: (move?: Move, piece?: Piece) => FEN;
  move: (from: Key, to: Key) => void;
}

export type StepperProps = {
  steps: Step[];
  className?: string;
} & StepSystemProps;

export type StepToolbox = FunctionComponent<{
  active: boolean;
  addStepHandler?: () => void;
  addExerciseHandler?: () => void;
  textChangeHandler?: (text: string) => void;
  text?: string;
}>;

export type LessonPlayground = FunctionComponent<{
  board: ReactElement;
  sidebar: ReactElement;
}>;

export type LessonToolboxText = FunctionComponent<{
  onChange?: (text: string) => void;
  defaultText?: string;
  placeholder?: string;
}>;

// Move written in chess notation
export type StepMove = FunctionComponent<
  {
    className?: string;
    showIndex?: boolean;
    prefix?: string | ReactElement;
    suffix?: string | ReactElement;
    blackIndexSign?: string | ReactElement;
  } & NotableMove
>;

export type StepTag = FunctionComponent<{
  children: ReactNode;
  active: boolean;
  step: Step;
  className?: string;
  moveIndex?: number;
  movedPiece?: Piece;
}>;

export interface ActionProps {
  onClick?: () => void;
}

export interface AuthorizedProps {
  children: ReactElement | ((authorized: boolean) => ReactElement);
}
