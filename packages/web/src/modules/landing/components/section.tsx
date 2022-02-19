import { ReactNode } from 'react';
import styled from '@chess-tent/styled-props';

type SectionProps = {
  fill?: boolean;
  className?: string;
  children: ReactNode;
};

const Section = styled.div.fill.css<SectionProps>`
  ${{ omitProps: ['fill'] }}
  
  background: var(--light-color);
  padding: 120px 0;
  &.fill {
    background: var(--bg-color);
  }
`;

export default Section;
