import BOffcanvas from 'react-bootstrap/Offcanvas';
import { UI } from '@types';
import application from '@application';

const Offcanvas = BOffcanvas as UI['Offcanvas'];

Offcanvas.defaultProps = {
  ...BOffcanvas.defaultProps,
  placement: 'end',
  show: true,
};

application.ui.Offcanvas = Offcanvas;
