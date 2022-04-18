import styled, { css } from '@chess-tent/styled-props';
import { constants } from '@application';

const { MAX_BOARD_SIZE } = constants;

export default styled.div.css<{
  width: string | number;
  height?: string | number;
}>`
  margin: 1em auto;
  max-width: ${MAX_BOARD_SIZE};

  &:empty {
    display: none;
  }

  ${({ width, height }) => css`
    width: ${width};
    height: ${height};
  `}
`;
