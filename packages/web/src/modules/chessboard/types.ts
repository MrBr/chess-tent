import { ChessboardInterface, ChessboardProps } from '@types';
import { Config } from '@chess-tent/chessground/dist/config';
import { Api } from '@chess-tent/chessground/dist/api';

export type ChessgroundMapper =
  | string
  | ((boardRef: ChessboardInterface, config: Partial<Config>) => void);
export type ChessgroundMappedPropsType = Record<
  keyof Omit<
    ChessboardProps,
    | 'header'
    | 'footer'
    | 'onToggleEvaluation'
    | 'onReset'
    | 'onChange'
    | 'onMove'
    | 'onShapesChange'
    | 'onShapeAdd'
    | 'onShapeRemove'
    | 'validateMove'
    | 'validateDrawable'
    | 'evaluate'
    | 'size'
    | 'sparePieces'
    | 'onPieceDrop'
    | 'onPieceRemove'
    | 'onClear'
    | 'onOrientationChange'
    | 'onUpdateEditing'
    | 'onFENSet'
    | 'editing'
    | 'onPGN'
    | 'allowEvaluation'
  >,
  ChessgroundMapper
>;
