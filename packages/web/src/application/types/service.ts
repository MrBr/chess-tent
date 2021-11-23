import { ChessInstance, Move as ChessMove } from 'chess.js';
import { ComponentType, ReactElement } from 'react';
import { API, ApiMethods } from '@chess-tent/types';
import {
  Chapter,
  Step,
  StepType,
  Notification,
  Activity,
  User,
  Mentorship,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveShort,
  NotableMove,
  Orientation,
  Piece,
  PieceColor,
  PieceRole,
  PieceRolePromotable,
  PieceRoleShort,
} from './chess';
import { MoveStep, Steps, VariationStep } from './steps';
import { History } from './router';
import { GenericArguments } from './_helpers';
import { ActivityComment, ActivityStepStateBase, StepModule } from './step';
import { AppAnalysis, NotificationRenderer, StepModules } from './index';

export type Services = {
  Chess: {
    new (fen?: string): ChessInstance;
  };
  createFenForward: (fen: FEN, moves: Move[]) => FEN;
  createFenBackward: (fen: FEN, moves: Move[]) => FEN;
  getPiece: (position: FEN, square: string) => Piece | null;
  getTurnColor: (position: FEN) => PieceColor;
  setTurnColor: (position: FEN, color: PieceColor) => FEN;
  createMoveShortObject: (
    move: Move,
    promoted?: PieceRolePromotable,
  ) => MoveShort;
  shortenRole: (role: PieceRole) => PieceRoleShort;
  createPiece: (
    role: PieceRole,
    color: PieceColor,
    promoted?: boolean,
  ) => Piece;
  createNotableMove: (
    position: FEN,
    move: Move,
    index: number,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => NotableMove;
  createNotableMovesFromHistory: (history: ChessMove[]) => NotableMove[];
  isSameStepMove: (
    step: VariationStep | MoveStep,
    move: NotableMove,
  ) => boolean;
  createStepsFromNotableMoves: (moves: NotableMove[]) => MoveStep[];
  getSameMoveVariationStep: (
    step: VariationStep | MoveStep,
    move: NotableMove,
  ) => VariationStep | null;
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
  isStepType: <T extends Steps>(step: Step, stepType: StepType) => step is T;
  createStep: <T extends StepType>(
    stepType: T,
    initialState: Parameters<StepModules[T]['createStep']>[1],
  ) => StepModules[T] extends StepModule<infer S, infer K> ? S : never;
  createActivity: <T extends Activity>(
    subject: T extends Activity<infer S, infer K> ? S : never,
    owner: User,
    state?: T extends Activity<infer S, infer K> ? K : never,
    users?: User[],
  ) => T;
  createActivityComment: (user: User, text: string) => ActivityComment;
  createActivityStepState: (initialState?: {}) => ActivityStepStateBase;
  updateActivityActiveStep: <T extends Activity>(activity: T, step: Steps) => T;
  getStepPosition: (step: Steps) => FEN;
  getStepBoardOrientation: (step: Steps) => PieceColor;
  updateStepRotation: (step: Steps, orientation?: Orientation) => Steps;
  addStepNextToTheComments: <T extends Steps>(parentStep: T, step: Steps) => T;
  createChapter: (title?: string, steps?: Step[]) => Chapter;
  history: History;
  createAnalysis: () => AppAnalysis;
  removeAnalysisStep: (analysis: AppAnalysis, step: Step) => AppAnalysis;
  pushToast: (toast: ReactElement) => void;
  registerNotificationRenderer: <T extends Notification>(
    notificationType: Notification['notificationType'],
    renderer: T extends Notification ? NotificationRenderer<T> : never,
  ) => void;
  isMentorship: (
    mentorship: Mentorship[],
    student: User,
    mentor: User,
  ) => boolean;
};
