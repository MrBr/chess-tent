import application from '@application';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

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
import { Container, Row, Col, Page } from './Grid';
import {
  Display1,
  Display2,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
  Text,
} from './Text';

application.ui.FormGroup = FormGroup;
application.ui.Form = Form;
application.ui.Button = Button;
application.ui.Label = Label;
application.ui.Input = Input;
application.ui.File = File;
application.ui.Check = Check;
application.ui.ErrorMessage = ErrorMessage;

application.ui.Container = Container;
application.ui.Page = Page;
application.ui.Row = Row;
application.ui.Col = Col;

application.ui.Modal = Modal;
application.ui.Confirm = Confirm;

application.ui.Display1 = Display1;
application.ui.Display2 = Display2;
application.ui.Headline1 = Headline1;
application.ui.Headline2 = Headline2;
application.ui.Headline3 = Headline3;
application.ui.Headline4 = Headline4;
application.ui.Headline5 = Headline5;
application.ui.Headline6 = Headline6;
application.ui.Text = Text;
