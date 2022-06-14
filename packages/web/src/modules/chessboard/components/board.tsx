import { ui, constants, services } from '@application';
import {
  ChessboardProps,
  ChessboardContext,
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
  Promotion,
  ChessInstance,
} from '@types';

import React, { Component, RefObject } from 'react';
import { Chessground } from '@chess-tent/chessground';
import _ from 'lodash';
import { Api } from '@chess-tent/chessground/dist/api';
import { MouchEvent } from '@chess-tent/chessground/dist/types';
import { State as CGState } from '@chess-tent/chessground/dist/state';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import { Config } from '@chess-tent/chessground/dist/config';

import { SparePieces } from './spare-pieces';
import PromotionPrompt from './promotion';
import BoardContainer from './board-container';
import BoardHeader from './board-header';
import BoardFooter from './board-footer';
import Footer from './footer';
import {
  ChessgroundMappedProps,
  replaceFENPosition,
  unfreeze,
} from '../_helpers';
import { ChessgroundMappedPropsType, ChessgroundMapper } from '../types';
import { BoardContext } from '../context';

const { START_FEN, KINGS_FEN } = constants;
const { Modal } = ui;
const {
  Chess,
  createMoveShortObject,
  getEvaluationBestMove,
  createMoveShape,
  getPiece,
  getTurnColor,
  switchTurnColor,
} = services;

export type State = CGState;

// Chessground resizing expects custom event to be
// triggered on the document.body once resizing occur.
window.addEventListener('resize', () =>
  document.body.dispatchEvent(new Event('chessground.resize')),
);

class Chessboard
  extends Component<ChessboardProps>
  implements ChessboardInterface
{
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
  chess: ChessInstance;
  // @ts-ignore
  context: ChessboardContext;
  // There is no easy way to detect context change.
  // prevContext is artificial made to be able to detect context change.
  prevContext?: ChessboardContext;
  static contextType = BoardContext;
  static defaultProps = {
    evaluate: false,
    viewOnly: false,
    fen: START_FEN,
    animation: false,
    resizable: true,
    selectablePieces: false,
    eraseDrawableOnClick: false,
    size: '50%',
    edit: false,
    orientation: 'white',
    shapes: [],
    allowAllMoves: true,
    allowEvaluation: true,
  };

  constructor(props: ChessboardProps) {
    super(props);
    this.chess = new Chess();
  }

  componentDidMount() {
    const { fen } = this.props;
    const { promotion, update } = this.context;

    const boardContextConfig: Partial<ChessboardContext> = {
      board: this,
    };
    if (promotion) {
      // reset context;
      boardContextConfig.promotion = null;
    }

    if (!this.boardHost.current) {
      return;
    }

    // Use only to set static values (for now)
    this.api = Chessground(this.boardHost.current, {
      fen,
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
    if (Object.keys(boardContextConfig).length > 0) {
      update(boardContextConfig);
    }
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
    // Shapes are few lines later
    if (finalConfig.drawable?.shapes) {
      delete finalConfig.drawable.shapes;
    }

    this.api.set(finalConfig);
    // Shapes can't be set in the same time as fen so this is additional update
    // TODO - edit Chessground
    shapes && this.api.setShapes(shapes);

    finalConfig.fen && this.chess.load(finalConfig.fen);
  }

  prompt(renderPrompt: ChessboardContext['renderPrompt']) {
    this.context.update({
      renderPrompt,
    });
  }

  closePrompt = () => {
    this.context.update({ renderPrompt: undefined });
  };

  componentDidUpdate(prevProps: ChessboardProps) {
    const { fen } = this.props;
    const { promotion, update } = this.context;
    if (fen !== prevProps.fen && promotion) {
      update({ promotion: null });
    }
    this.syncChessgroundState(prevProps);

    if (this.prevContext !== this.context) {
      this.syncAutoShapes();
    }
    this.prevContext = this.context;
  }

  /**
   * Have in mind that mapper can have functions to change chessground state dynamically.
   * Those changes aren't seen here. Look at helpers for that
   */
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
          updateConfig(this, update);
        }
        return update;
      },
      {},
    );
    Object.keys(patch).length > 0 && this.setConfig(patch);
  }

  /**
   * Life is hard.
   * Auto shapes are used for user uncontrolled shapes.
   * Because auto shapes are defined through both context and props this sync is needed.
   * Context change is undetectable (no prevContext) hence has to be set on the fly.
   * Props autoShapes change is easily detected but it needs context value.
   * This method reconcile props and context and as such should be exclusively used for setting autoShapes.
   */
  syncAutoShapes() {
    const propsAutoShapes = this.props.autoShapes || [];

    const evaluations = this.context.evaluate ? this.context.evaluations : [];
    const evaluationShapes = Object.values(evaluations)
      .map(getEvaluationBestMove)
      .filter(Boolean)
      .map(move => createMoveShape([move.from, move.to], false, 20));

    this.api.setAutoShapes([...propsAutoShapes, ...evaluationShapes]);
  }

  getState() {
    return this.api.state;
  }

  onEvaluationMove = (moves: NotableMove[]) => {
    const { fen } = this.props;
    if (this.props.onMove && moves.length === 1) {
      // Next engine move shouldn't be looked at as a variation
      // Single move in evaluation line is for sure next.
      const { position, move, piece, captured, promoted } = moves[0];
      this.props.onMove(
        position,
        move,
        piece,
        !!captured,
        promoted as PieceRolePromotable,
      );
    } else if (this.props.onPGN) {
      // This is useful trick for the moment
      // evaluation variation can be considered as a variation
      this.props.onPGN(moves, { FEN: fen }, []);
    } else {
      console.warn('Nothing handling evaluation move.');
    }
  };

  toggleEvaluation = () => {
    const { update, evaluate, evaluations } = this.context;
    update({ evaluate: !evaluate, evaluations });
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
      // This only handles if promotion is actually an "illegal" move
      // in case board is edited
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

  onShapesChange: ChessboardProps['onShapesChange'] = _.debounce(shapes => {
    if (!this.props.onShapesChange) {
      return;
    }

    // Breaking reference
    // In rare cases a conditional race can occur when new shape is drawn
    // just after the reference is being frozen by the immer.
    // The issue is caused because chessground isn't behaving in immutable way.
    const newShapes = [...shapes];
    return this.props.onShapesChange(newShapes);
  }, 500);

  onPromotionCancel = () => {
    this.setConfig({ fen: this.chess.fen() });
    this.context.update({ promotion: null });
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
      this.context.update({
        promotion: {
          from: orig as Key,
          to: dest as Key,
          piece: piece,
          captured: !!metadata.captured,
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

  onPromotion = ({ from, to, piece }: Promotion, role: PieceRolePromotable) => {
    const capturedPiece = this.chess.get(to);
    this.context.update({ promotion: null });
    const move = [from, to] as Move;
    const fen = this.fen(move, { piece, promoted: role });

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
    const { header, fen, editing, sparePieces, footer, onPGN } = this.props;
    const { renderPrompt, promotion } = this.context;

    const sparePiecesElement = sparePieces ? (
      <SparePieces
        onDragStart={this.onSparePieceDrag}
        className="spare-pieces"
      />
    ) : null;

    return (
      <>
        <div className="h-100 overflow-y-hidden d-flex flex-column fit-content m-auto">
          <BoardHeader>{header}</BoardHeader>
          <BoardContainer
            boardRef={this.boardHost}
            boardExtras={sparePiecesElement}
          >
            {promotion && (
              <PromotionPrompt
                promotion={promotion}
                onPromote={this.onPromotion}
                onCancel={this.onPromotionCancel}
              />
            )}
          </BoardContainer>
          <BoardFooter className="mt-4">
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
        </div>
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
