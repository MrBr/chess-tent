import React, { Component, ReactElement, ReactNode, RefObject } from 'react';
import styled from '@emotion/styled';
import { Chessground } from 'chessground';
import _ from 'lodash';

import { Api } from 'chessground/api';
import { FEN, Key } from 'chessground/types';
import { State as CGState } from 'chessground/state';
import { DrawCurrent, DrawShape } from 'chessground/src/draw';
import { Move, Shape } from '../app/types';
import { Modal } from '../ui/Modal';

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
    | 'onReset'
    | 'onChange'
    | 'onShapesChange'
    | 'validateMove'
    | 'validateDrawable'
  >,
  string
>;

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1';

const ChessgroundMappedProps: ChessgroundMappedPropsType = {
  viewOnly: 'viewOnly',
  fen: 'fen',
  shapes: 'drawable.shapes',
  eraseDrawableOnClick: 'drawable.eraseOnClick',
  animation: 'animation.enabled',
};

const BoardHeader = styled.div({
  display: 'flex',
  height: 50,
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Board = styled.div({});

export interface ChessboardProps {
  header?: ReactNode;
  onReset?: Function;
  // Chessground proxy props
  viewOnly?: boolean;
  fen?: FEN;
  animation: boolean;
  onChange?: (position: FEN, lastMove?: Move) => void;
  onShapesChange?: (shapes: DrawShape[]) => void;
  validateMove?: (orig: Key, dest: Key) => boolean;
  validateDrawable?: (
    newDrawShape: DrawCurrent,
    curDrawShape: DrawCurrent,
  ) => boolean;
  eraseDrawableOnClick?: boolean;
  shapes?: Shape[];
}

export interface ChessboardState {
  renderPrompt?: (close: () => void) => ReactElement;
}

class Chessboard extends Component<ChessboardProps, ChessboardState> {
  boardHost: RefObject<HTMLDivElement> = React.createRef();
  api: Api = new Proxy({}, {}) as Api;
  state: ChessboardState = {
    renderPrompt: undefined,
  };
  static defaultProps = {
    viewOnly: false,
    fen: 'start',
    animation: false,
    eraseDrawableOnClick: false,
    onChange: () => {},
    validateMove: () => true,
  };

  componentDidMount() {
    const {
      animation,
      fen,
      viewOnly,
      shapes,
      eraseDrawableOnClick,
    } = this.props;

    if (!this.boardHost.current) {
      return;
    }

    this.api = Chessground(this.boardHost.current, {
      viewOnly,
      fen,
      animation: {
        enabled: animation,
        duration: 0,
      },
      movable: {
        validate: this.validateMove,
      },
      drawable: {
        validate: this.validateDrawable,
        onChange: this.onShapesChange,
        eraseOnClick: eraseDrawableOnClick,
        shapes,
      },
      events: {
        change: this.onChange,
      },
    });
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
    Object.keys(patch).length > 0 && this.api.set(patch);
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
    return this.api.getFen() + ' w - - 0 1';
  };

  move(from: Key, to: Key) {
    this.api.move(from, to);
  }

  onReset = () => {
    const { onReset } = this.props;
    onReset && onReset();
  };

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

  onShapesChange: ChessboardProps['onShapesChange'] = (...args) => {
    if (!this.props.onShapesChange) {
      return;
    }
    return this.props.onShapesChange(...args);
  };

  onChange = () => {
    const fen = this.api.getFen();
    const lastMove = this.api.state.lastMove as Move;
    this.props.onChange && this.props.onChange(fen, lastMove);
  };

  render() {
    const { header } = this.props;
    const { renderPrompt } = this.state;
    return (
      <>
        <BoardHeader>{header}</BoardHeader>
        <Board id="board" ref={this.boardHost} />
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

export { Board, START_FEN };

export default Chessboard;
