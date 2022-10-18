import { ChessInstance } from 'chess.js';
import { ComponentType, ReactElement } from 'react';
import {
  API,
  GetEndpointData,
  GetRequestFetchArgs,
  GetRequestFetchData,
  GetRequestFetchEndpoint,
  GetRequestFetchMethod,
  GetRequestFetchUrl,
  RequestFetch,
} from '@chess-tent/types';
import {
  Chapter,
  Step,
  StepType,
  Notification,
  User,
  Mentorship,
  LessonActivity,
  PatchListener,
  LessonActivityBoardState,
} from '@chess-tent/models';
import {
  FEN,
  Key,
  Move,
  MoveComment,
  MoveShort,
  NotableMove,
  Orientation,
  Piece,
  PieceColor,
  PieceColorShort,
  PieceRole,
  PieceRolePromotable,
  PieceRoleShort,
  Shape,
} from './chess';
import { MoveStep, Steps, VariationStep } from './steps';
import { History } from './router';
import { GenericArguments } from './_helpers';
import { ActivityComment, ActivityStepStateBase, StepModule } from './step';
import {
  AppAnalysis,
  Evaluation,
  NotificationRenderer,
  StepModules,
} from './index';
import { Searchable } from './search';

export type Services = {
  Chess: {
    new (fen?: string): ChessInstance;
  };
  createFenForward: (fen: FEN, moves: Move[]) => FEN;
  createFenBackward: (fen: FEN, moves: Move[]) => FEN;
  createMoveShape: (move: Move, opponent: boolean, lineWidth?: number) => Shape;
  createPonderMoveShape: (evaluation: Evaluation) => Shape;
  getPiece: (position: FEN, square: string) => Piece | null;
  getTurnColor: (position: FEN) => PieceColor;
  setTurnColor: (position: FEN, color: PieceColor) => FEN;
  switchTurnColor: (position: FEN) => FEN;
  uciToSan: (uciMove: string) => MoveShort;
  createMoveShortObject: (
    move: Move,
    promoted?: PieceRolePromotable,
  ) => MoveShort;
  shortenRole: (role: PieceRole) => PieceRoleShort;
  shortenColor: (color: PieceColor) => PieceColorShort;
  extendRole: (role: PieceRoleShort) => PieceRole;
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
  isLegalMove: (
    position: FEN,
    move: Move,
    promoted?: PieceRolePromotable,
    bothColors?: boolean,
  ) => boolean;
  createNotableMovesFromGame: (game: ChessInstance) => NotableMove[];
  getComment: (comments: MoveComment[], position: FEN) => string | undefined;
  getNextMoveIndex: (prevMove?: NotableMove | null) => number;
  getFenPosition: (fen: string) => string;
  getFenEnPassant: (fen: string) => string;
  getSquareFile: (square: Key) => string;
  getSquareRank: (square: Key) => string;
  isSameStepMove: (
    step: VariationStep | MoveStep,
    move: NotableMove,
  ) => boolean;
  createStepsFromNotableMoves: (
    moves: NotableMove[],
    options?: { comments?: MoveComment[]; orientation?: Orientation },
  ) => MoveStep[];
  getSameMoveStep: (
    step: VariationStep | MoveStep,
    move: NotableMove,
  ) => VariationStep | MoveStep | null;
  // Add non infrastructural providers
  // Allow modules to inject their own non dependant Providers
  addProvider: (provider: ComponentType) => void;
  addRoute: (route: ComponentType) => void;

  api: API;
  createRequest<T extends RequestFetch<any, any>>(
    method: GetRequestFetchMethod<T>,
    urlOrCustomizer:
      | GetRequestFetchUrl<T>
      | ((
          ...args: GenericArguments<GetRequestFetchArgs<T>>
        ) => GetRequestFetchUrl<T>),
  ): GetRequestFetchMethod<T> extends 'GET' | 'DELETE' // GET request data is irrelevant
    ? T
    : GetRequestFetchArgs<T> extends GetEndpointData<GetRequestFetchEndpoint<T>>
    ? T
    : unknown;
  createRequest<T extends RequestFetch<any, any>>(
    method: GetRequestFetchMethod<T>,
    urlOrCustomizer:
      | GetRequestFetchUrl<T>
      | ((
          ...args: GenericArguments<GetRequestFetchArgs<T>>
        ) => GetRequestFetchUrl<T>),
    data: (
      ...args: GenericArguments<GetRequestFetchArgs<T>>
    ) => GetRequestFetchData<T>,
  ): T;
  isStepType: <T extends Steps>(step: Step, stepType: StepType) => step is T;
  createStep: <T extends StepType>(
    stepType: T,
    initialState: Parameters<StepModules[T]['createStep']>[1],
  ) => StepModules[T] extends StepModule<infer S, any, any, any> ? S : never;
  createActivityComment: (user: User, text: string) => ActivityComment;
  createLessonActivityStepState: (initialState?: {}) => ActivityStepStateBase;
  updateLessonActivityActiveStep: (
    activity: LessonActivity,
    board: LessonActivityBoardState,
    step: Steps,
    patchListener?: PatchListener,
  ) => LessonActivity;
  getStepPosition: (step: Steps) => FEN;
  getStepBoardOrientation: (step: Steps) => PieceColor;
  updateStepRotation: (step: Steps, orientation?: Orientation) => Steps;
  createChapter: (title?: string, steps?: Step[]) => Chapter;
  history: History;
  createAnalysis: () => AppAnalysis;
  removeAnalysisStep: (analysis: AppAnalysis, step: Step) => AppAnalysis;
  pushToast: (toast: ReactElement) => void;
  registerNotificationRenderer: <T extends Notification>(
    notificationType: Notification['notificationType'],
    renderer: T extends Notification ? NotificationRenderer<T> : never,
  ) => void;
  registerSearchable(searchable: Searchable): void;
  isMentorship: (
    mentorship: Mentorship[],
    student: User,
    mentor: User,
  ) => boolean;
  logException: (exception: Error) => void;
  getEvaluationBestMove: (evaluation: Evaluation) => MoveShort;
  getEvaluationPonderMove: (evaluation: Evaluation) => MoveShort;
};
