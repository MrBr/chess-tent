import styled from '@emotion/styled';
import React, { Component, ReactChildren, RefObject } from 'react';
import { rightMouse } from '../addons';
import _ from 'lodash';

import Chessboard, {
  ChessboardProps,
  getSquare,
  SquareKey,
} from '../chessboardjs';

const SelectableSquare = styled.div<{ selected: boolean }>(
  {
    width: '100%',
    height: '100%',
  },
  ({ selected }) =>
    selected && {
      background: 'rgba(0,0,0,0.5)',
    },
);

const INITIAL_STATE = { squares: {} };

interface Square {
  selected: boolean;
}

interface AdvancedChessboardProps extends ChessboardProps {
  onSquaresUpdate?: Function;
  validateSelect?: Function;
  onSquareSelected?: Function;
  onSquareDeselected?: Function;
}

export interface AdvancedChessboardState {
  squares: { [key: string]: Square };
}

class AdvancedChessboard extends Component<
  AdvancedChessboardProps,
  AdvancedChessboardState
> {
  board: RefObject<Chessboard>;

  constructor(props: AdvancedChessboardProps) {
    super(props);
    this.board = React.createRef();
    this.state = { ...INITIAL_STATE };
  }

  onMouseDown = (...args: [MouseEvent]) => {
    rightMouse(this.rightMouseDown)(...args);
    const { onMouseDown } = this.props;
    onMouseDown && onMouseDown(...args);
  };

  onReset = (...args: []) => {
    const { onReset } = this.props;
    this.updateState({ ...INITIAL_STATE }, this.onSquaresUpdate);
    onReset && onReset(...args);
  };

  getSquares() {
    return this.state.squares;
  }

  getSquare(square: SquareKey) {
    return this.getSquares()[square] || {};
  }

  onSquaresUpdate = () => {
    const { onSquaresUpdate } = this.props;
    onSquaresUpdate && onSquaresUpdate(this.getSquares());
  };

  onSquareSelected = (square: SquareKey) => {
    const { onSquareSelected } = this.props;
    const state = this.getSquare(square);
    onSquareSelected && onSquareSelected(square, state);
  };

  onSquareDeselected = (square: SquareKey) => {
    const { onSquareDeselected } = this.props;
    const state = this.getSquare(square);
    onSquareDeselected && onSquareDeselected(square, state);
  };

  updateState(state: AdvancedChessboardState, cb: Function) {
    this.setState(state, () => {
      cb && cb();
      _.defer(
        () =>
          this.board && this.board.current && this.board.current.updateBoard(),
      );
    });
  }

  updateSquare(square: SquareKey, patch: Square, cb?: Function) {
    const newSquaresState = { ...this.getSquares() };
    const state = this.getSquare(square);

    newSquaresState[square] = { ...state, ...patch };

    if (Object.keys(newSquaresState[square]).every(prop => !prop)) {
      delete newSquaresState[square];
    }

    this.updateState(
      {
        squares: newSquaresState,
      },
      () => {
        cb && cb(square, patch);
        this.onSquaresUpdate();
      },
    );
  }

  selectSquare(square: SquareKey) {
    const { validateSelect } = this.props;
    if (validateSelect && !validateSelect(square)) {
      return;
    }
    this.updateSquare(
      square,
      {
        selected: true,
      },
      this.onSquareSelected,
    );
  }

  deselectSquare(square: SquareKey) {
    this.updateSquare(
      square,
      {
        selected: false,
      },
      this.onSquareDeselected,
    );
  }

  toggleSquareState(square: SquareKey) {
    const stateSquare = this.getSquare(square);
    stateSquare.selected
      ? this.deselectSquare(square)
      : this.selectSquare(square);
  }

  rightMouseDown = (e: MouseEvent) => {
    const square = getSquare(e.currentTarget as HTMLElement);
    this.toggleSquareState(square);
  };

  renderSquare = (children: ReactChildren, square: SquareKey) => {
    const { selected } = this.getSquare(square);
    return <SelectableSquare selected={selected}>{children}</SelectableSquare>;
  };

  render() {
    const { onSquaresUpdate, ...chessboardProps } = this.props;
    return (
      <Chessboard
        {...chessboardProps}
        ref={this.board}
        renderSquare={this.renderSquare}
        onMouseDown={this.onMouseDown}
        onReset={this.onReset}
      />
    );
  }
}

export default AdvancedChessboard;
