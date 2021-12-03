import styled from '@emotion/styled';
import { constants } from '@application';

const { MAX_BOARD_SIZE } = constants;

export default styled.div<{
  width: string | number;
}>(
  {
    margin: '1em auto',
    maxWidth: MAX_BOARD_SIZE,
  },
  ({ width }) => ({ width }),
);
