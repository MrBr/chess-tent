import { Component, ReactElement, ReactNode, RefObject } from 'react';
import { FEN, Key } from 'chessground/types';
import { DrawCurrent, DrawShape } from 'chessground/src/draw';
import { Api } from 'chessground/api';
import { Section, Step } from '@chess-tent/models';
import { Move, Shape } from './chess';
import { StepSystemProps } from './step';

export interface ChessboardState {
  renderPrompt?: (close: () => void) => ReactElement;
}

export interface ChessboardProps {
  header?: ReactNode;
  onReset?: Function;
  evaluate?: boolean;
  // Chessground proxy props
  viewOnly?: boolean;
  fen: FEN;
  animation?: boolean;
  onChange?: (position: FEN, lastMove?: Move) => void;
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
  section: Section;
  current?: Step;
  className?: string;
  onStepClick?: (step: Step) => void;
} & StepSystemProps;

export interface ActionProps {
  onClick?: () => void;
}
