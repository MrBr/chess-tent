import styled from '@emotion/styled';
import { UI } from '@types';
import { ComponentProps } from 'react';

export default styled.div<ComponentProps<UI['Absolute']>>(
  {
    display: 'inline-block',
    position: 'absolute',
  },
  ({ top, right, bottom, left, zIndex }) => ({
    top,
    right,
    bottom,
    left,
    zIndex,
  }),
);
