import { ui, components, constants, services } from '@application';
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
  FEN,
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
import { replaceFENPosition, updateMovable } from './_helpers';

const { Evaluator } = components;
const { START_FEN, MAX_BOARD_SIZE } = constants;
const { Modal } = ui;
const { Chess, createMoveShortObject } = services;

export type State = CGState;

type ChessgroundMappedPropsType = Record<
  keyof Omit<
    ChessboardProps,
    | 'header'
    | 'footer'
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
  >,
  string
>;

const ChessgroundMappedProps: ChessgroundMappedPropsType = {
  viewOnly: 'viewOnly',
  fen: 'fen',
  shapes: 'drawable.shapes',
  selectablePieces: 'selectable.enabled',
  resizable: 'resizable',
  eraseDrawableOnClick: 'drawable.eraseOnClick',
  animation: 'animation.enabled',
  allowAllMoves: 'movable.free',
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
  };

  constructor(props: ChessboardProps) {
    super(props);
    this.chess = new Chess();
  }

  componentDidMount() {
    const {
      animation,
      fen,
      viewOnly,
      eraseDrawableOnClick,
      selectablePieces,
      resizable,
      allowAllMoves,
      orientation,
    } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, { fen });
    this.setConfig({
      viewOnly,
      fen,
      resizable,
      orientation,
      draggable: {
        deleteOnDropOff: true,
      },
      selectable: { enabled: selectablePieces },
      animation: {
        enabled: animation,
        duration: 0,
      },
      movable: {
        free: allowAllMoves,
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
        eraseOnClick: eraseDrawableOnClick,
        onAdd: this.onShapeAdd,
        onRemove: this.onShapeRemove,
      },
      events: {
        // Control change event because chessground doesn't handle well all FEN changes.
        // change: this.onChange,
        dropNewPiece: this.onPieceDrop,
        removePiece: this.onPieceRemove,
      },
    });
  }

  /**
   * Helper function to workaround some Chessground issues until they are fixed
   * @param config
   */
  setConfig(config: Partial<Config>) {
    const finalConfig = this.props.allowAllMoves
      ? config
      : updateMovable(config, config.fen || this.props.fen);
    this.api.set(finalConfig);
    // Shapes can't be set in the same time as fen so this is additional update
    // TODO - edit Chessground
    this.props.shapes && this.api.setShapes([...this.props.shapes]);
    config.fen && this.chess.load(config.fen);
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

  syncChessgroundState(prevProps: ChessboardProps) {
    const patch = Object.entries(ChessgroundMappedProps).reduce<{}>(
      (update, entry) => {
        const [propName, chessGroundStatePropPath] = entry as [
          keyof ChessgroundMappedPropsType,
          string,
        ];
        if (
          ChessgroundMappedProps[propName] &&
          prevProps[propName] !== this.props[propName]
        ) {
          _.set(update, chessGroundStatePropPath, this.props[propName]);
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

  removeShape(shape: DrawShape) {
    this.api.state.drawable.shapes = this.api.state.drawable.shapes.filter(
      item => item !== shape,
    );
    this.props.onShapesChange &&
      this.props.onShapesChange(this.api.state.drawable.shapes);
    this.api.redrawAll();
  }

  resetBoard = () => {
    this.api.set({
      fen: this.props.fen,
    });
    this.onReset();
  };

  fen = (() => {
    // FEN Memoization
    // Board fen can be requested by multiple methods on a single change (that triggers multiple events).
    // This memoization prevents multiple calculations and potential fen overrides on a single change.
    let lastFen: FEN;
    return (
      move?: Move,
      options?: { piece?: Piece; promoted?: PieceRolePromotable },
    ) => {
      const { allowAllMoves } = this.props;
      const fen = this.api.getFen();
      if (fen === lastFen) {
        return this.chess.fen();
      }
      lastFen = fen;
      if (move && allowAllMoves && options?.promoted) {
        const { promotion } = createMoveShortObject(move, options?.promoted);
        const piece = this.chess.get(move[0]);
        if (!piece || !promotion) {
          return lastFen;
        }
        this.chess.remove(move[0]);
        this.chess.put(
          {
            type: promotion,
            color: piece.color,
          },
          move[1],
        );
      } else if (allowAllMoves) {
        this.chess.load(
          // Update position and color who's turn is.
          // Useful for variation to automatically start with a correct color.
          replaceFENPosition(
            this.chess.fen(),
            this.api.getFen(),
            options?.piece,
          ),
        );
      } else if (move) {
        const chessMove = createMoveShortObject(move, options?.promoted);
        // Only valid moves are allowed in "play" mode
        this.chess.move(chessMove);
      }
      return this.chess.fen();
    };
  })();

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

  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  };

  onClear = () => {
    const { onClear } = this.props;
    onClear && onClear();
  };

  onUpdateEditing = (editing: boolean) => {
    const { onUpdateEditing } = this.props;
    onUpdateEditing && onUpdateEditing(editing);
  };

  onFENSet = (FEN: string) => {
    const { onFENSet } = this.props;
    onFENSet && onFENSet(FEN);
  };

  onShapeAdd = (shape: DrawShape) => {};

  onShapeRemove = (shape: DrawShape) => {};

  onShapesChange: ChessboardProps['onShapesChange'] = (...args) => {
    if (!this.props.onShapesChange) {
      return;
    }
    return this.props.onShapesChange(...args);
  };

  onChange = () => {
    if (!this.props.onChange) {
      return;
    }
    const fen = this.fen();
    this.props.onChange(fen);
  };

  onPieceDrop = (piece: Piece, key: ExtendedKey) => {
    if (!this.props.onPieceDrop) {
      return;
    }
    const fen = this.fen();
    this.onChange();
    this.props.onPieceDrop(fen, piece, key as Key);
  };

  onPieceRemove = (piece: Piece, key: ExtendedKey) => {
    if (!this.props.onPieceRemove) {
      return;
    }
    const fen = this.fen();
    this.onChange();
    this.props.onPieceRemove(fen, piece, key as Key);
  };

  onMove = (orig: ExtendedKey, dest: ExtendedKey, metadata: MoveMetadata) => {
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]] as Piece;
    const rank = parseInt(dest.charAt(1));
    if (piece.role === 'pawn' && (rank === 1 || rank === 8)) {
      this.setState({
        promotion: {
          from: orig as Key,
          to: dest as Key,
          piece,
        },
      });
      return;
    }
    if (!this.props.onMove) {
      return;
    }
    const fen = this.fen(lastMove, { piece });
    this.onChange();
    this.props.onMove(fen, lastMove, piece, !!metadata.captured);
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

    this.props.onMove &&
      this.props.onMove(fen, move, piece, !!capturedPiece, role);
  };

  onPromotionCancel = () => {
    this.setConfig({ fen: this.chess.fen() });
    this.setState({ promotion: undefined });
  };

  onSparePieceDrag = (piece: Piece, event: MouchEvent) => {
    this.api.dragNewPiece(piece, event);
  };

  render() {
    const {
      header,
      fen,
      evaluate,
      editing,
      size,
      sparePieces,
      footer,
    } = this.props;
    const { renderPrompt, promotion } = this.state;
    const sparePiecesElement = sparePieces ? (
      <SparePieces
        onDragStart={this.onSparePieceDrag}
        className="spare-pieces"
      />
    ) : null;
    return (
      <>
        {false && (
          <Evaluator
            evaluate={evaluate}
            position={fen}
            onBestMoveChange={console.log}
            onEvaluationChange={console.log}
          />
        )}
        <BoardHeader width={size as string}>{header}</BoardHeader>
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
          {footer || (
            <Footer
              editing={!!editing}
              onReset={this.onReset}
              onClear={this.onClear}
              updateEditing={this.onUpdateEditing}
              onFENSet={this.onFENSet}
              position={fen}
              onRotate={this.onRotate}
            />
          )}
        </BoardFooter>
        <Modal
          container={this.boardHost}
          show={!!renderPrompt}
          style={{ position: 'absolute' }}
          backdrop={false}
        >
          {renderPrompt && renderPrompt(this.closePrompt)}
        </Modal>
      </>
    );
  }
}
export default Chessboard;
