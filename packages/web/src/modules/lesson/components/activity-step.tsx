import React from 'react';
import styled from '@chess-tent/styled-props';

const Step = styled(({ children, className, onClick, active }: any) => {
  return (
    <div className={`${className} ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </div>
  );
}).css`
  &.active {
    background: var(--tertiary-color);
  }

  & > & {
    margin-left: 15px;
  }

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--grey-500-color);
  overflow: hidden;
`;

export default Step;
