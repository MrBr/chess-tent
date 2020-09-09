import { ui, components, constants } from '@application';
import {
  ChessboardProps,
  ChessboardState,
  Move,
  Piece,
  ChessboardInterface,
  MoveMetadata,
} from '@types';

import React, { Component, FunctionComponent, RefObject } from 'react';
import styled from '@emotion/styled';
import { Chessground } from '@chess-tent/chessground';
import _ from 'lodash';
import { Api } from '@chess-tent/chessground/dist/api';
import { Key, MouchEvent } from '@chess-tent/chessground/dist/types';
import { State as CGState } from '@chess-tent/chessground/dist/state';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import { Config } from '@chess-tent/chessground/dist/config';

import { SparePieces } from './spare-pieces';

const { Evaluator } = components;
const { START_FEN } = constants;
const { Modal } = ui;

export type State = CGState;

// prettier-ignore
export type SquareKey =
/* eslint-disable */
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1' |
    'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
    'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
    'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
    'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
    'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
    'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
    'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8';
/* eslint-enable */

export type PositionObject = Record<SquareKey, string>;

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
  width: width,
  paddingBottom: height,
  position: 'relative',
  margin: 'auto',
}));

class Chessboard extends Component<ChessboardProps, ChessboardState>
  implements ChessboardInterface {
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
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
    onChange: () => {},
    validateMove: () => true,
    width: '70%',
    height: '70%',
  };

  componentDidMount() {
    const {
      animation,
      fen,
      viewOnly,
      eraseDrawableOnClick,
      selectablePieces,
      resizable,
    } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, {});
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
    this.api.set(config);
    // Shapes can't be set in the same time as fen so this is additional update
    // TODO - edit Chessground
    this.props.shapes && this.api.setShapes([...this.props.shapes]);
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

  fen = () => {
    return this.api.getFen() + ' b - - 0 1';
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
    const fen = this.fen();
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]];
    this.props.onChange && this.props.onChange(fen, lastMove, piece);
  };

  onMove = (orig: string, dest: string, metadata: MoveMetadata) => {
    const fen = this.fen();
    const lastMove = this.api.state.lastMove as Move;
    const piece = this.api.state.pieces[lastMove[1]] as Piece;
    this.props.onMove &&
      this.props.onMove(fen, lastMove, piece, !!metadata.captured);
  };

  onSparePieceDrag = (piece: Piece, event: MouchEvent) => {
    this.api.dragNewPiece(piece, event);
  };

  render() {
    const { header, fen, evaluate, footer, width, height } = this.props;
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
        <SparePieces onDragStart={this.onSparePieceDrag} />
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
