import React, { Component, ReactChildren, ReactNode } from 'react';
import styled from '@emotion/styled';
import Button from 'react-bootstrap/Button';

import ChessboardService from './js/chessboard-0.3.0';
import './css/chessboard-0.3.0.css';

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

const Board = styled.div({
  width: 450,
  height: 450,
});

export interface ChessboardProps {
  draggable?: boolean;
  position?: string;
  tip?: string;
  onChange?: (
    position: string,
    oldPosition: PositionObject,
    newPosition: PositionObject,
  ) => void;
  onDrop?: Function;
  onReset?: Function;
  onMouseDown?: Function;
  validateDrop?: Function;
  renderSquare?: Function;
}

class Chessboard extends Component<ChessboardProps> {
  board: any;
  static defaultProps = {
    draggable: true,
    position: 'start',
    onChange: () => {},
    onDrop: () => {},
    validateDrop: () => true,
  };

  componentDidMount() {
    const { position, draggable } = this.props;
    this.board = ChessboardService('board', {
      // Don't map props directly
      // because board is not in the sync with the props!
      renderSquare: this.renderSquare,
      showNotation: false,
      onDrop: this.onDrop,
      onChange: this.onChange,
      onMouseDown: this.onMouseDown,
      sparePieces: true,
      draggable,
      position,
    });
  }

  componentDidUpdate(prevProps: ChessboardProps) {
    const { draggable } = this.props;
    if (draggable !== prevProps.draggable) {
      this.board.draggable = draggable;
    }
  }

  updateBoard() {
    this.board.update();
  }

  resetBoard = () => {
    this.board.start();
    this.onReset();
  };

  fen = () => {
    return this.board.fen();
  };

  move(from: string, to: string) {
    this.board.move(`${from}-${to}`);
  }

  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  };

  onMouseDown = (...args: [any]) => {
    const { onMouseDown } = this.props;
    onMouseDown && onMouseDown(...args);
  };

  onDrop = (...args: []) => {
    const shouldDropPiece = this.props.validateDrop
      ? this.props.validateDrop(...args)
      : true;
    shouldDropPiece && this.props.onDrop && this.props.onDrop(...args);
    return !shouldDropPiece ? 'snapback' : undefined;
  };

  onChange = (oldPosition: PositionObject, newPosition: PositionObject) => {
    this.props.onChange &&
      this.props.onChange(
        ChessboardService.objToFen(newPosition),
        oldPosition,
        newPosition,
      );
  };

  renderSquare = (children: ReactChildren, square: ReactNode) => {
    const { renderSquare } = this.props;
    return renderSquare ? renderSquare(children, square) : children;
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
        <Board id="board" />
      </>
    );
  }
}

const Cols: string[] = 'abcdefgh'.split('');
const Rows: string[] = '12345678'.split('');
const Squares = Cols.reduce<SquareKey[]>((result, col: string) => {
  Rows.forEach((row: string) => result.push((col + row) as SquareKey));
  return result;
}, []);
const getSquare = (elem: HTMLElement): SquareKey =>
  elem.getAttribute('data-square') as SquareKey;
export { Board, Cols, Rows, Squares, getSquare };

export default Chessboard;
