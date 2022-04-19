import styled from '@chess-tent/styled-props';
import { UI } from '@types';

const Line = styled.hr.css`
  display: block;
  background: var(--black-color);
  opacity: 0.1;
  height: 1px;
  width: 100%;
  margin: 0;
` as UI['Line'];

export default Line;
