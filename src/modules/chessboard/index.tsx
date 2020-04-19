import React, { Component, ReactChildren, ReactNode, RefObject } from 'react';
import styled from '@emotion/styled';
import Button from 'react-bootstrap/Button';
import { Chessground } from 'chessground';

import { Api } from 'chessground/api';
import { FEN, Key } from 'chessground/types';
import { State as CGState } from 'chessground/state';
import { DrawCurrent, DrawShape } from 'chessground/src/draw';

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

const BoardHeader = styled.div({
  display: 'flex',
  height: 50,
  justifyContent: 'space-between',
  alignItems: 'center',
});
const BoardHeaderActions = styled.div({
  flex: 0,
});

const Board = styled.div({});

export interface ChessboardProps {
  tip?: string;
  onReset?: Function;
  // Chessground proxy props
  viewOnly?: boolean;
  position?: FEN;
  onChange?: (position: FEN, lastMove?: Key[]) => void;
  onShapesChange?: (shapes: DrawShape[]) => void;
  validateMove?: (orig: Key, dest: Key) => boolean;
  validateDrawable?: (
    newDrawShape: DrawCurrent,
    curDrawShape: DrawCurrent,
  ) => boolean;
  eraseDrawableOnClick?: boolean;
}

class Chessboard extends Component<ChessboardProps> {
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
  static defaultProps = {
    viewOnly: false,
    position: 'start',
    eraseDrawableOnClick: false,
    onChange: () => {},
    validateMove: () => true,
  };

  componentDidMount() {
    const { position, viewOnly } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, {
      viewOnly,
      fen: position,
      movable: {
        validate: this.props.validateMove,
      },
      drawable: {
        validate: this.props.validateDrawable,
        onChange: this.props.onShapesChange,
        eraseOnClick: this.props.eraseDrawableOnClick,
      },
      events: {
        change: this.onChange,
      },
    });
  }

  componentDidUpdate(prevProps: ChessboardProps) {
    const { viewOnly } = this.props;
    if (viewOnly !== prevProps.viewOnly) {
      this.api.set({
        viewOnly: viewOnly,
      });
    }
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
      fen: this.props.position,
    });
    this.onReset();
  };

  fen = () => {
    return this.api.getFen();
  };

  move(from: Key, to: Key) {
    this.api.move(from, to);
  }

  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  };

  onChange = () => {
    const fen = this.api.getFen();
    const lastMove = this.api.state.lastMove;
    this.props.onChange && this.props.onChange(fen, lastMove);
  };

  render() {
    const { tip } = this.props;
    return (
      <>
        <BoardHeader>
          {tip}
          <BoardHeaderActions>
            <Button variant="secondary" onClick={this.resetBoard}>
              Reset
            </Button>
          </BoardHeaderActions>
        </BoardHeader>
        <Board id="board" ref={this.boardHost} />
      </>
    );
  }
}

export { Board };

export default Chessboard;
