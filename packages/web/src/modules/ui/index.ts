import application from '@application';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Button } from './Button';
import { Form, Input, ErrorMessage, FormGroup, Label } from './Form';
import { Modal, Confirm } from './Modal';

application.ui.Button = Button;
application.ui.Form = Form;
application.ui.Label = Label;
application.ui.Input = Input;
application.ui.FormGroup = FormGroup;
application.ui.ErrorMessage = ErrorMessage;
application.ui.Modal = Modal;
application.ui.Confirm = Confirm;
