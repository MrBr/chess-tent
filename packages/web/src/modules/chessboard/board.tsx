import { components, ui, constants, services } from '@application';
import {
  ChessboardProps,
  ChessboardState,
  Move,
  Piece,
  ChessboardInterface,
  MoveMetadata,
  Key,
  ExtendedKey,
  PieceRolePromotable,
  NotableMove,
  MoveComment,
  FEN,
  Evaluation,
} from '@types';

import { ChessInstance } from 'chess.js';
import React, {
  Component,
  FunctionComponent,
  ReactElement,
  RefObject,
} from 'react';
import styled from '@emotion/styled';
import { Chessground } from '@chess-tent/chessground';
import _ from 'lodash';
import { Api } from '@chess-tent/chessground/dist/api';
import { MouchEvent } from '@chess-tent/chessground/dist/types';
import { State as CGState } from '@chess-tent/chessground/dist/state';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import { Config } from '@chess-tent/chessground/dist/config';

import { SparePieces } from './spare-pieces';
import Promotion from './promotion';
import Footer from './footer';
import { replaceFENPosition, toDests, unfreeze } from './_helpers';
import { getPiece, getTurnColor, switchTurnColor } from '../chess/service';

const { START_FEN, MAX_BOARD_SIZE, KINGS_FEN } = constants;
const { Modal, Absolute } = ui;
const {
  Chess,
  createMoveShortObject,
  getEvaluationBestMove,
  createMoveShape,
} = services;
const { Evaluator, EvaluationBar, EvaluationLines } = components;

export type State = CGState;

type ChessgroundMapper =
  | string
  | ((props: ChessboardProps, config: Partial<Config>, api: Api) => void);
type ChessgroundMappedPropsType = Record<
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
  >,
  ChessgroundMapper
>;

const ChessgroundMappedProps: ChessgroundMappedPropsType = {
  viewOnly: 'viewOnly',
  fen: (props, update) => {
    // Chessground needs legal moves list in "strict mode";
    // Legal moves are resolved bellow
    const dests = props.allowAllMoves
      ? null
      : toDests(props.fen, props.movableColor === 'both');
    const turnColor = getTurnColor(props.fen);

    _.set(update, 'fen', props.fen);
    _.set(update, 'movable.dests', dests);
    _.set(update, 'turnColor', turnColor);
  },
  shapes: 'drawable.shapes',
  selectablePieces: 'selectable.enabled',
  resizable: 'resizable',
  eraseDrawableOnClick: 'drawable.eraseOnClick',
  animation: 'animation.enabled',
  evaluation: (props, update, api) => {
    api.setAutoShapes([]);
  },
  allowAllMoves: (props, update) => {
    _.set(update, 'movable.free', props.allowAllMoves);
    _.set(
      update,
      'movable.color',
      props.movableColor || props.allowAllMoves
        ? 'both'
        : getTurnColor(props.fen),
    );
    (ChessgroundMappedProps.fen as Function)(props, update);
  },
  movableColor: 'movable.color',
  orientation: 'orientation',
};

const BoardHeader = styled.div<{
  width: string | number;
}>(
  {
    margin: '1em auto',
    maxWidth: MAX_BOARD_SIZE,
  },
  ({ width }) => ({ width }),
);

const BoardContainer = styled<
  FunctionComponent<{
    size: string | number;
    className?: string;
    boardRef: RefObject<any>;
    boardExtras?: ReactElement | null;
  }>
>(props => (
  <div className={props.className}>
    <div className="board-height">
      {props.boardExtras}
      <div ref={props.boardRef} className="board" />
    </div>
    {props.children}
  </div>
))(({ size }) => ({
  '& > .board-height': {
    paddingTop: '100%',
  },
  '& .board-height > .board': {
    position: 'absolute',
    width: '100%',
  },
  '.spare-pieces': {
    '.piece': {
      width: '6%',
      paddingTop: '6%',
      marginBottom: '2%',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    },
    width: '100%',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateX(calc(-6% - 20px)) translateY(-50%)',
  },
  zIndex: 10, // important for dragged piece to cover spare piece base
  width: size,
  position: 'relative',
  margin: 'auto',
  maxWidth: MAX_BOARD_SIZE,
  maxHeight: MAX_BOARD_SIZE,
  boxSizing: 'content-box',
}));

const BoardFooter = styled.div<{
  width: string | number;
}>(
  {
    margin: '1em auto',
    maxWidth: MAX_BOARD_SIZE,
  },
  ({ width }) => ({ width }),
);

// Chessground resizing expects custom event to be
// triggered on the document.body once resizing occur.
window.addEventListener('resize', () =>
  document.body.dispatchEvent(new Event('chessground.resize')),
);

class Chessboard
  extends Component<ChessboardProps, ChessboardState>
  implements ChessboardInterface {
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
  chess: ChessInstance;
  state: ChessboardState = {
    renderPrompt: undefined,
    promotion: undefined,
    evaluations: {},
  };
  static defaultProps = {
    evaluate: false,
    viewOnly: false,
    fen: START_FEN,
    animation: false,
    resizable: true,
    selectablePieces: false,
    eraseDrawableOnClick: false,
    size: '80%',
    edit: false,
    orientation: 'white',
    shapes: [],
    allowAllMoves: true,
  };

  constructor(props: ChessboardProps) {
    super(props);
    this.chess = new Chess();
  }

  componentDidMount() {
    const { fen } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, { fen });
    // Use only to set static values (for now)
    this.setConfig({
      draggable: {
        deleteOnDropOff: true,
      },
      premovable: {
        enabled: false,
      },
      animation: {
        duration: 500,
      },
      movable: {
        validate: this.validateMove,
        events: {
          after: this.onMove,
        },
      },
      drawable: {
        validate: this.validateDrawable,
        onChange: this.onShapesChange,
        visible: true,
        enabled: true,
        onAdd: this.onShapeAdd,
        onRemove: this.onShapeRemove,
      },
      events: {
        // Control change event because chessground doesn't handle well all FEN changes.
        // change: this.unhandledFenChange,
        dropNewPiece: this.onPieceDrop,
        removePiece: this.onPieceRemove,
      },
    });
    // Map variable values (props)
    this.syncChessgroundState({});
  }

  /**
   * Helper function to workaround some Chessground issues until they are fixed
   * @param config
   */
  setConfig(config: Partial<Config>) {
    // Chessground for some reason mutates config, on the other hand
    // Immer freezes passed values. All that leads to forbidden mutations.
    // In order to allow Chessground to work as planned passed object
    // must be mutable and thus reference must be broken between prop and config values.
    const finalConfig = unfreeze(config);

    const shapes = finalConfig.drawable?.shapes;
    if (finalConfig.drawable?.shapes) {
      delete finalConfig.drawable.shapes;
    }

    this.api.set(finalConfig);
    // Shapes can't be set in the same time as fen so this is additional update
    // TODO - edit Chessground
    shapes && this.api.setShapes(shapes);

    finalConfig.fen && this.chess.load(finalConfig.fen);
  }

  prompt(renderPrompt: ChessboardState['renderPrompt']) {
    this.setState({
      renderPrompt,
    });
  }

  closePrompt = () => {
    this.setState({ renderPrompt: undefined });
  };

  componentDidUpdate(prevProps: ChessboardProps) {
    this.syncChessgroundState(prevProps);
  }

  syncChessgroundState(prevProps: Partial<ChessboardProps>) {
    const patch = Object.entries(ChessgroundMappedProps).reduce<{}>(
      (update, entry) => {
        const [propName, mapper] = entry as [
          keyof ChessgroundMappedPropsType,
          ChessgroundMapper,
        ];
        if (prevProps[propName] !== this.props[propName]) {
          const updateConfig =
            typeof mapper === 'function'
              ? mapper
              : () => _.set(update, mapper, this.props[propName]);
          updateConfig(this.props, update, this.api);
        }
        return update;
      },
      {},
    );
    Object.keys(patch).length > 0 && this.setConfig(patch);
  }

  getState() {
    return this.api.state;
  }

  getBestEvaluation() {
    return this.state.evaluations[1];
  }

  updateEvaluation = (evaluation: Evaluation) => {
    if (!this.props.evaluation) {
      return;
    }

    const evaluations: ChessboardState['evaluations'] = {
      ...this.state.evaluations,
      [evaluation.lineIndex]: evaluation,
    };

    this.setState({ evaluations });
    const shapes = Object.values(evaluations)
      .map(getEvaluationBestMove)
      .filter(Boolean)
      .map(move => createMoveShape([move.from, move.to], false, 20));

    this.api.setAutoShapes(shapes);
  };

  removeShape(shape: DrawShape) {
    this.api.state.drawable.shapes = this.api.state.drawable.shapes.filter(
      item => item !== shape,
    );
    this.props.onShapesChange &&
      this.props.onShapesChange(this.api.state.drawable.shapes);
    this.api.redrawAll();
  }

  fen = (
    move?: Move,
    options?: { piece?: Piece; promoted?: PieceRolePromotable },
  ) => {
    const { allowAllMoves, movableColor } = this.props;

    const oldFen = this.chess.fen();
    const chess = new Chess(oldFen);

    if (move && allowAllMoves && options?.promoted) {
      const { promotion } = createMoveShortObject(move, options?.promoted);
      const piece = chess.get(move[0]);
      if (piece && promotion) {
        chess.remove(move[0]);
        chess.put(
          {
            type: promotion,
            color: piece.color,
          },
          move[1],
        );
      }
    } else if (allowAllMoves) {
      const fenPieces = this.api.getFen();
      const newFen = replaceFENPosition(chess.fen(), fenPieces, options?.piece);
      const didLoadFen = chess.load(
        // Update position and color who's turn is.
        // Useful for variation to automatically start with a correct color.
        newFen,
      );
      if (!didLoadFen) {
        const fenInfo = chess.validate_fen(newFen);
        throw new Error(`Invalid fen ${newFen}. Error: ${fenInfo.error}`);
      }
    } else if (move) {
      const chessMove = createMoveShortObject(move, options?.promoted);
      const piece = getPiece(oldFen, move[0]);
      // Only valid moves are allowed in "play" mode
      let validMove =
        piece?.color === getTurnColor(oldFen) && chess.move(chessMove);
      if (!validMove && movableColor === 'both') {
        // NOTE - chess position is changed
        chess.load(switchTurnColor(oldFen));
        validMove = chess.move(chessMove);
      }
      if (!validMove) {
        throw new Error(`Invalid move ${move}.`);
      }
    }
    return chess.fen();
  };

  move(from: Key, to: Key) {
    this.api.move(from, to);
  }

  validateMove: ChessboardProps['validateMove'] = (...args) => {
    if (!this.props.validateMove) {
      return true;
    }
    return this.props.validateMove(...args);
  };

  validateDrawable: ChessboardProps['validateDrawable'] = (...args) => {
    if (!this.props.validateDrawable) {
      return true;
    }
    return this.props.validateDrawable(...args);
  };

  onRotate = () => {
    const { onOrientationChange } = this.props;
    this.api.toggleOrientation();
    onOrientationChange && onOrientationChange(this.api.state.orientation);
  };

  onUpdateEditing = (editing: boolean) => {
    const { onUpdateEditing } = this.props;
    onUpdateEditing && onUpdateEditing(editing);
  };

  onPGN = (moves: NotableMove[], headers: {}, comments: MoveComment[]) => {
    const { onPGN } = this.props;
    onPGN && onPGN(moves, headers, comments);
  };

  onShapeAdd = (shape: DrawShape) => {};

  onShapeRemove = (shape: DrawShape) => {};

  onShapesChange: ChessboardProps['onShapesChange'] = (...args) => {
    if (!this.props.onShapesChange) {
      return;
    }

    return this.props.onShapesChange(...args);
  };

  onPromotionCancel = () => {
    this.setConfig({ fen: this.chess.fen() });
    this.setState({ promotion: undefined });
  };

  onSparePieceDrag = (piece: Piece, event: MouchEvent) => {
    this.api.dragNewPiece(piece, event);
  };

  /**
   * Fallback event when specific event handler hasn't been defined.
   * Used for "generic" position updates on all position changing events.
   *
   * Don't use this function directly on the board events, only as fallback!
   * Board fen isn't formatted properly.
   * @param fen
   */
  unhandledFenChange = (fen: FEN) => {
    if (!this.props.onChange) {
      console.warn(
        `Position changed but no handler is listening to the change. 
        This will result in unsynced position on the board and in the props`,
      );
      return;
    }
    this.props.onChange(fen);
  };

  /**
   * Position changing event handlers.
   * All events that affect position should be defined bellow.
   */
  onPieceDrop = (piece: Piece, key: ExtendedKey) => {
    const fen = this.fen();
    if (!this.props.onPieceDrop) {
      this.unhandledFenChange(fen);
      return;
    }
    this.props.onPieceDrop(fen, piece, key as Key);
  };

  onPieceRemove = (piece: Piece, key: ExtendedKey) => {
    const fen = this.fen();
    if (!this.props.onPieceRemove) {
      this.unhandledFenChange(fen);
      return;
    }
    this.props.onPieceRemove(fen, piece, key as Key);
  };

  onMove = (orig: ExtendedKey, dest: ExtendedKey, metadata: MoveMetadata) => {
    const { onMove } = this.props;
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]] as Piece;
    const rank = parseInt(dest.charAt(1));
    if (piece.role === 'pawn' && (rank === 1 || rank === 8)) {
      this.setState({
        promotion: {
          from: orig as Key,
          to: dest as Key,
          piece: piece,
        },
      });
      return;
    }

    const fen = this.fen(lastMove, { piece });

    if (!onMove) {
      this.unhandledFenChange(fen);
      return;
    }
    onMove(fen, lastMove, piece, !!metadata.captured);
  };

  onPromotion = (role: PieceRolePromotable) => {
    const { promotion } = this.state;
    if (!promotion) {
      return;
    }

    const { from, to, piece } = promotion;
    const capturedPiece = this.chess.get(to);
    this.setState({ promotion: undefined });
    const move = [from, to] as Move;
    const fen = this.fen(move, { promoted: role });

    if (!this.props.onMove) {
      this.unhandledFenChange(fen);
      return;
    }
    this.props.onMove(fen, move, piece, !!capturedPiece, role);
  };

  onReset = () => {
    if (this.props.viewOnly) {
      return;
    }

    const fen = START_FEN;
    if (!this.props.onReset) {
      this.unhandledFenChange(fen);
      return;
    }
    this.props.onReset(fen);
  };

  onClear = () => {
    if (this.props.viewOnly) {
      return;
    }

    const fen = KINGS_FEN;
    if (!this.props.onClear) {
      this.unhandledFenChange(fen);
      return;
    }
    this.props.onClear(fen);
  };

  onFENSet = (FEN: string) => {
    if (this.props.viewOnly) {
      return;
    }

    if (!this.props.onFENSet) {
      this.unhandledFenChange(FEN);
      return;
    }
    this.props.onFENSet(FEN);
  };

  render() {
    const {
      header,
      fen,
      editing,
      size,
      sparePieces,
      footer,
      onPGN,
      onToggleEvaluation,
      evaluation,
    } = this.props;
    const { renderPrompt, promotion, evaluations } = this.state;

    const bestEvaluation = this.getBestEvaluation();
    const sparePiecesElement = sparePieces ? (
      <SparePieces
        onDragStart={this.onSparePieceDrag}
        className="spare-pieces"
      />
    ) : null;

    return (
      <>
        <BoardHeader width={size as string}>{header}</BoardHeader>
        <BoardHeader width={size as string} className="position-relative">
          <Absolute right={10} top={-40}>
            <Evaluator
              position={fen}
              evaluate={evaluation}
              onToggle={onToggleEvaluation}
              onEvaluationChange={this.updateEvaluation}
            />
          </Absolute>
          {evaluation && bestEvaluation && (
            <EvaluationBar evaluation={bestEvaluation} />
          )}
          {evaluation &&
            Object.values(evaluations).map(evaluation => (
              <EvaluationLines evaluation={evaluation} position={fen} />
            ))}
        </BoardHeader>
        <BoardContainer
          size={size as string}
          boardRef={this.boardHost}
          boardExtras={sparePiecesElement}
        >
          {promotion && (
            <Promotion
              file={promotion.to}
              color={promotion.piece.color}
              onPromote={this.onPromotion}
              onCancel={this.onPromotionCancel}
            />
          )}
        </BoardContainer>
        <BoardFooter className="mt-4" width={size as number}>
          {footer === undefined ? (
            <Footer
              editing={!!editing}
              onReset={this.onReset}
              onClear={this.onClear}
              updateEditing={this.onUpdateEditing}
              onFENSet={this.onFENSet}
              position={fen}
              onRotate={this.onRotate}
              onPGN={onPGN && this.onPGN}
            />
          ) : (
            footer
          )}
        </BoardFooter>
        <Modal
          container={this.boardHost}
          show={!!renderPrompt}
          className="position-absolute"
          backdrop={false}
        >
          {renderPrompt && renderPrompt(this.closePrompt)}
        </Modal>
      </>
    );
  }
}
export default Chessboard;
