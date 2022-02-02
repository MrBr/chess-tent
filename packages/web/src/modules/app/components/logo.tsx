import styled from '@emotion/styled';

import logoUrl from '../images/logo.svg';

const Logo = styled.img({
  width: 150,
});

Logo.defaultProps = {
  src: logoUrl,
};

export default Logo;
