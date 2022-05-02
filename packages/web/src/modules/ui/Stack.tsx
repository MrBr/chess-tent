import { Children, ComponentProps } from 'react';
import styled, { css } from '@chess-tent/styled-props';
import { UI } from '@types';

const STACK_LIMIT = 3;

const Stack = styled.div.css<ComponentProps<UI['Stack']>>`
  text-align: right;
  position: relative;
  height: 100%;

  > * {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);

    &:nth-child(n + ${4}) {
      display: none;
    }

    &:first-child {
    }

    &:nth-child(2) {
      transform: translateX(-50%) translateY(-50%);
    }

    &:nth-child(3) {
      transform: translateX(-100%) translateY(-50%);
    }
  }

  ${({ children }) => css`
    :before {
      position: absolute;
      content: '${Children.count(children) - STACK_LIMIT > 0
        ? '+' + (Children.count(children) - STACK_LIMIT) + ' '
        : ''}';
    }
  `}
`;

export default Stack;
