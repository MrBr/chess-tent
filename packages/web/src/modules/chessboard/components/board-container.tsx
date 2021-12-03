import React, { FunctionComponent, RefObject, ReactElement } from 'react';
import styled from '@emotion/styled';
import { constants } from '@application';

const { MAX_BOARD_SIZE } = constants;

export default styled<
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
