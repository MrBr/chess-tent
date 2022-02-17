import styled from '@chess-tent/styled-props';

import underlineUrl from '../images/underline.svg';

const Underline = styled.span.css`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  transform: translateY(25%);
  background: url(${underlineUrl}) center no-repeat;
  height: 25px;
`;

export default Underline;
