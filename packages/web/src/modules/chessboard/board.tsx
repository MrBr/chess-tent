import { ui, components, constants, services } from '@application';
import {
  ChessboardProps,
  ChessboardState,
  Move,
  Piece,
  ChessboardInterface,
  MoveMetadata,
  Key,
} from '@types';

import { ChessInstance } from 'chess.js';
import React, { Component, FunctionComponent, RefObject } from 'react';
import styled from '@emotion/styled';
import { Chessground } from '@chess-tent/chessground';
import _ from 'lodash';
import { Api } from '@chess-tent/chessground/dist/api';
import { MouchEvent } from '@chess-tent/chessground/dist/types';
import { State as CGState } from '@chess-tent/chessground/dist/state';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import { Config } from '@chess-tent/chessground/dist/config';

import { SparePieces } from './spare-pieces';
import { replaceFENPosition, updateMovable } from './_helpers';

const { Evaluator } = components;
const { START_FEN } = constants;
const { Modal } = ui;
const { Chess } = services;

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
    | 'width'
    | 'height'
    | 'sparePieces'
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
  edit: 'movable.free',
};

const BoardHeader = styled.div<{
  width: string | number;
}>(
  {
    display: 'flex',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ({ width }) => ({ width }),
);

const BoardFooter = styled.div<{
  width: string | number;
}>(
  {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 720,
    margin: 'auto',
  },
  ({ width }) => ({ width }),
);

const BoardContainer = styled<
  FunctionComponent<{
    width: string | number;
    height: string | number;
    className?: string;
    boardRef: RefObject<any>;
  }>
>(props => (
  <div className={props.className}>
    <div ref={props.boardRef} className="board" />
  </div>
))(({ width, height }) => ({
  '& > .board': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    width: '100%',
    height: '100%',
    maxWidth: 720,
    maxHeight: 720,
  },
  zIndex: 10, // important for dragged piece to cover spare piece base
  width: width,
  paddingBottom: height,
  position: 'relative',
  margin: 'auto',
}));

// Chessground resizing expects custom event to be
// triggered on the document.body once resizing occur.
window.addEventListener('resize', () =>
  document.body.dispatchEvent(new Event('chessground.resize')),
);

class Chessboard extends Component<ChessboardProps, ChessboardState>
  implements ChessboardInterface {
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
  chess: ChessInstance;
  state: ChessboardState = {
    renderPrompt: undefined,
  };
  static defaultProps = {
    evaluate: false,
    viewOnly: false,
    fen: START_FEN,
    animation: false,
    resizable: true,
    selectablePieces: false,
    eraseDrawableOnClick: false,
    width: '70%',
    height: '70%',
    edit: false,
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
      edit,
    } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, { fen });
    this.setConfig({
      viewOnly,
      fen,
      resizable,
      selectable: { enabled: selectablePieces },
      animation: {
        enabled: animation,
        duration: 0,
      },
      movable: {
        free: edit,
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
        change: this.onChange,
      },
    });
  }

  /**
   * Helper function to workaround some Chessground issues until they are fixed
   * @param config
   */
  setConfig(config: Partial<Config>) {
    const finalConfig = this.props.edit
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

  fen = (move?: Move, piece?: Piece) => {
    const { edit } = this.props;
    if (edit) {
      this.chess.load(
        // Update position and color who's turn is.
        // Useful for variation to automatically start with a correct color.
        replaceFENPosition(this.chess.fen(), this.api.getFen(), piece),
      );
    } else if (move) {
      // Only valid moves are in "play" mode
      this.chess.move({ from: move[0], to: move[1] });
    }
    return this.chess.fen();
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

  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  };

  onShapeAdd = (shape: DrawShape) => {};

  onShapeRemove = (shape: DrawShape) => {};

  onShapesChange: ChessboardProps['onShapesChange'] = (...args) => {
    if (!this.props.onShapesChange) {
      return;
    }
    return this.props.onShapesChange(...args);
  };

  // TODO - use move event?
  onChange = () => {
    if (!this.props.onChange) {
      return;
    }
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]];
    const fen = this.fen(lastMove, piece);
    this.props.onChange(fen, lastMove, piece);
  };

  onMove = (orig: string, dest: string, metadata: MoveMetadata) => {
    if (!this.props.onMove) {
      return;
    }
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]] as Piece;
    const fen = this.fen(lastMove, piece);
    this.props.onMove(fen, lastMove, piece, !!metadata.captured);
  };

  onSparePieceDrag = (piece: Piece, event: MouchEvent) => {
    this.api.dragNewPiece(piece, event);
  };

  render() {
    const {
      header,
      fen,
      evaluate,
      footer,
      width,
      height,
      sparePieces,
    } = this.props;
    const { renderPrompt } = this.state;
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
        <BoardHeader width={width as string}>{header}</BoardHeader>
        <BoardContainer
          width={width as string}
          height={height as string}
          boardRef={this.boardHost}
        />
        <BoardFooter width={width as string}>{footer}</BoardFooter>
        {sparePieces && (
          <SparePieces onDragStart={this.onSparePieceDrag} />
        )}{' '}
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
