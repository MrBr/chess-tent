import BOffcanvas from 'react-bootstrap/Offcanvas';
import { UI } from '@types';
import application from '@application';
import styled from '@chess-tent/styled-props';

const Offcanvas = BOffcanvas as UI['Offcanvas'];

Offcanvas.defaultProps = {
  ...BOffcanvas.defaultProps,
  placement: 'end',
  show: true,
};

Offcanvas.Header = styled(Offcanvas.Header).css`
  padding: 30px;
  position: relative;
  
  :after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 30px;
    right: 30px;  
    border-bottom: 1px solid var(--grey-500-color);
  }
`;

Offcanvas.Header.defaultProps = { ...Offcanvas.Header, closeButton: true };

application.ui.Offcanvas = Offcanvas;
