import { ChessInstance } from 'chess.js';
import { ComponentType, ReactElement } from 'react';
import {
  API,
  ApiMethods,
  RecordMeta,
  RecordType,
  RecordValue,
} from '@chess-tent/types';
import {
  Chapter,
  Step,
  StepType,
  Notification,
  Activity,
  User,
} from '@chess-tent/models';
import { History } from 'history';
import { MiddlewareAPI } from 'redux';
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
import { ActivityComment, ActivityStepStateBase, StepModule } from './step';
import { AppAnalysis, NotificationRenderer, StepModules } from './index';

export type RecordService<T extends RecordValue> = {
  record: RecordType<T>;
  update: (value: T, meta?: {}) => void;
  updateValue: (value: RecordType<T>['value']) => void;
};

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
  createRecordService: <T extends RecordValue>(
    recordKey: string,
    recordType: RecordMeta['type'],
  ) => (store: MiddlewareAPI) => RecordService<T>;
  createRecordHook: <T extends RecordValue>(
    recordKey: string,
    type: RecordMeta['type'],
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
  createActivityComment: (user: User, text: string) => ActivityComment;
  createActivityStepState: (initialState?: {}) => ActivityStepStateBase;
  getStepPosition: (step: Steps) => FEN;
  getStepBoardOrientation: (step: Steps) => PieceColor;
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
};
