import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Dot = styled.span.props.variant.size.css`
  border-radius: 50%;
  display: inline-block;
  width: 8px;
  height: 8px;
  border: 1px solid var(--light-color);
  
  &.small {
    width: 5px;
    height: 5px;
  }

  &.secondary {
    background: var(--secondary-color);
  }

  &.success {
    background: var(--success-color);
  }

  &.error {
    background: var(--error-color);
  }

  &.neutral {
    background: var(--grey-400-color);
    border-color: var(--grey-400-color);
  }
` as UI['Dot'];

Dot.defaultProps = {
  variant: 'secondary',
};

export default Dot;
