import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Dot = styled.span.css`
  border-radius: 50%;
  background: var(--secondary-color);
  display: inline-block;
  width: 8px;
  height: 8px;
  border: 1px solid var(--light-color);
` as UI['Dot'];

export default Dot;
