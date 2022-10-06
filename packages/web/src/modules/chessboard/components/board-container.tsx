import React, {
  MutableRefObject,
  ReactElement,
  useCallback,
  ReactNode,
} from 'react';
import styled from '@chess-tent/styled-props';

export default styled<{
  className?: string;
  boardRef: MutableRefObject<any>;
  boardExtras?: ReactElement | null;
  children: ReactNode;
}>(props => {
  const setRef = useCallback(
    ref => {
      // TODO - should be revised on resize
      if (!ref) {
        return;
      }
      // This logic is used to resize board exactly to fit the screen by the smallest dimension
      // between the board header and footer.
      const container = ref.parentNode?.parentNode?.parentNode;
      const availableHeight =
        container?.clientHeight -
        container?.children?.item(0)?.clientHeight - // header height
        container?.children?.item(2)?.clientHeight; // footer height
      const availableWidth =
        ref.parentNode?.parentNode?.parentNode?.parentNode?.clientWidth; // width of the content container
      const size =
        availableHeight > availableWidth ? availableWidth : availableHeight;
      (ref.parentNode as HTMLDivElement).style.width = `${size}px`;
      (ref.parentNode as HTMLDivElement).style.height = `${size}px`;
      props.boardRef.current = ref;
      // without resize CG has pieces misplaced
      document.body.dispatchEvent(new Event('chessground.resize'));
    },
    [props.boardRef],
  );

  return (
    <div className={props.className}>
      <div className="board-height">
        {props.boardExtras}
        <div ref={setRef} className="board" />
      </div>
      {props.children}
    </div>
  );
}).css`
  & > .board-height {
    position: relative;
  }

  & .board-height > .board {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .spare-pieces {
    .piece {
      width: 6%;
      padding-top: 6%;
      margin-bottom: 2%;
      background-position: center;
      background-size: cover;
    }

    width: 100%;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateX(calc(-6% - 20px)) translateY(-50%);
  }

  z-index: 10; // important for dragged piece to cover spare piece base
  position: relative;
  box-sizing: content-box;
`;
