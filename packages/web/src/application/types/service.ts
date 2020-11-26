import { ChessInstance } from 'chess.js';
import { ComponentType, ReactElement } from 'react';
import { API, ApiMethods, RecordValue } from '@chess-tent/types';
import {
  Analysis,
  Chapter,
  Step,
  StepType,
  Notification,
  Activity,
  User,
} from '@chess-tent/models';
import { History } from 'history';
import {
  FEN,
  Move,
  MoveShort,
  NotableMove,
  Piece,
  PieceColor,
  PieceRole,
  PieceRolePromotable,
  PieceRoleShort,
} from './chess';
import { MoveStep, Steps, VariationStep } from './steps';
import { GenericArguments } from './_helpers';
import { RecordHookReturn } from './hooks';
import { StepModule } from './step';
import { NotificationRenderer, StepModules } from './index';

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
  createNotableMove: (
    position: FEN,
    move: Move,
    index: number,
    piece: Piece,
    captured?: boolean,
    promoted?: PieceRole,
  ) => NotableMove;
  isSameStepMove: (
    step: VariationStep | MoveStep,
    move: NotableMove,
  ) => boolean;
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
  createRecordHook: <T extends RecordValue>(
    recordKey: string,
  ) => () => RecordHookReturn<T>;
  isStepType: <T extends Steps>(step: Step, stepType: StepType) => step is T;
  createStep: <T extends StepType>(
    stepType: T,
    initialState: Parameters<StepModules[T]['createStep']>[1],
  ) => StepModules[T] extends StepModule<infer S, infer K> ? S : never;
  createActivity: <T extends Activity>(
    subject: T extends Activity<infer S, infer K> ? S : never,
    owner: User,
    state: T extends Activity<infer S, infer K> ? K : never,
    users: User[],
  ) => T;
  getStepPosition: (step: Steps) => FEN;
  createChapter: (title?: string, steps?: Step[]) => Chapter;
  history: History;
  createAnalysis: (param: [Step] | FEN) => Analysis;
  removeAnalysisStep: (analysis: Analysis, step: Step) => Analysis;
  pushToast: (toast: ReactElement) => void;
  registerNotificationRenderer: <T extends Notification>(
    notificationType: Notification['notificationType'],
    renderer: T extends Notification ? NotificationRenderer<T> : never,
  ) => void;
};