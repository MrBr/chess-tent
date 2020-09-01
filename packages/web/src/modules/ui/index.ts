import application from '@application';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from './Button';
import {
  Form,
  Input,
  Check,
  ErrorMessage,
  FormGroup,
  Label,
  File,
} from './Form';
import { Modal, Confirm } from './Modal';
import { Container, Row, Col } from './Grid';

application.ui.Button = Button;
application.ui.Form = Form;
application.ui.Label = Label;
application.ui.Input = Input;
application.ui.File = File;
application.ui.Check = Check;
application.ui.Container = Container;
application.ui.Row = Row;
application.ui.Col = Col;
application.ui.FormGroup = FormGroup;
application.ui.ErrorMessage = ErrorMessage;
application.ui.Modal = Modal;
application.ui.Confirm = Confirm;
