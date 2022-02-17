import { ReactNode } from 'react';
import styled from '@chess-tent/styled-props';

const Section = styled.div.fill.css<{
  fill?: boolean;
  className?: string;
  children: ReactNode;
}>`
  background: var(--light-color);
  padding: 120px 0;
  &.fill {
    background: var(--bg-color);
  }
`;

export default Section;
