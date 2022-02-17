import styled from '@chess-tent/styled-props';

import logoUrl from '../images/logo.svg';

const Logo = styled.img.css`
  width: 150px;
`;

Logo.defaultProps = {
  src: logoUrl,
};

export default Logo;
