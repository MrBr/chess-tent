import {
  Component,
  FunctionComponent,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react';
import { FEN, Key, Piece } from '@chess-tent/chessground/dist/types';
import { DrawCurrent, DrawShape } from '@chess-tent/chessground/dist/draw';
import { Api } from '@chess-tent/chessground/dist/api';
import { Step } from '@chess-tent/models';
import { Move, Shape } from './chess';
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
  onShapesChange?: (shapes: DrawShape[]) => void;
  onShapeAdd?: (shape: DrawShape[]) => void;
  onShapeRemove?: (shape: DrawShape[]) => void;
  validateMove?: (orig: Key, dest: Key) => boolean;
  validateDrawable?: (
    newDrawShape: DrawCurrent,
    curDrawShape: DrawCurrent,
  ) => boolean;
  eraseDrawableOnClick?: boolean;
  shapes?: Shape[];
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
  fen: () => FEN;
  move: (from: Key, to: Key) => void;
}

export type StepperProps = {
  steps: Step[];
  className?: string;
  header?: ReactElement;
} & StepSystemProps;

export type StepToolbox = FunctionComponent<{
  active: boolean;
  addStepHandler?: () => void;
  addExerciseHandler?: () => void;
  textChangeHandler?: (text: string) => void;
  text?: string;
}>;

export type StepTag = FunctionComponent<{
  children: ReactNode;
  active: boolean;
  step: Step;
  className?: string;
}>;

export interface ActionProps {
  onClick?: () => void;
}

export interface AuthorizedProps {
  children: ReactElement | ((authorized: boolean) => ReactElement);
}
