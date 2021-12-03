import { ChessboardProps } from '@types';
import { Config } from '@chess-tent/chessground/dist/config';
import { Api } from '@chess-tent/chessground/dist/api';

export type ChessgroundMapper =
  | string
  | ((props: ChessboardProps, config: Partial<Config>, api: Api) => void);
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
    | 'updateMeta'
    | 'meta'
  >,
  ChessgroundMapper
>;
