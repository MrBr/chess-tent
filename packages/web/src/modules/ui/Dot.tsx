import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Dot = styled.span.css`
  border-radius: 50%;
  background: red;
  display: inline-block;
  width: 7px;
  height: 7px;
` as UI['Dot'];

export default Dot;
