import { ReactNode } from 'react';
import styled from '@chess-tent/styled-props';

const Section = styled.div.fill.css<{
  fill?: boolean;
  className?: string;
  children: ReactNode;
}>`
  background: var(--bg-color);
  padding: 120px 0;
  &.fill {
    background: var(--light-color);
  }
`;

export default Section;
