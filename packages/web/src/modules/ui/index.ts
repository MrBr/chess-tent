import application from '@application';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import { Button, ToggleButton } from './Button';
import {
  Form,
  Input,
  Check,
  ErrorMessage,
  FormGroup,
  Label,
  File,
  InputGroup,
} from './Form';
import { Container, Row, Col, Page } from './Grid';
import { Select, AsyncSelect } from './Select';
import Dropdown, { OptionsDropdown } from './Dropdown';
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
import SearchBox from './SearchBox';
import { Avatar, FramedProfile, Img, Thumbnail } from './Img';
import { CardBody, CardComponent, CardHeader } from './Card';
import { Tab, Tabs } from './Tab';
import Icon from './Icon';
import Absolute from './Absolute';
import { Toast, ToastBody, ToastHeader } from './Toast';
import { withFiles } from './hoc';

application.hoc.withFiles = withFiles;

application.register(() => import('./Modal'));

application.ui.FormGroup = FormGroup;
application.ui.Form = Form;
application.ui.Button = Button;
application.ui.ToggleButton = ToggleButton;
application.ui.Label = Label;
application.ui.Input = Input;
application.ui.InputGroup = InputGroup;
application.ui.File = File;
application.ui.Check = Check;
application.ui.ErrorMessage = ErrorMessage;
application.ui.Select = Select;
application.ui.AsyncSelect = AsyncSelect;

application.ui.Toast = Toast;
application.ui.ToastHeader = ToastHeader;
application.ui.ToastBody = ToastBody;

application.ui.Dropdown = Dropdown;
application.ui.OptionsDropdown = OptionsDropdown;

application.ui.Card = CardComponent;
application.ui.CardBody = CardBody;
application.ui.CardHeader = CardHeader;

application.ui.Img = Img;
application.ui.FramedProfile = FramedProfile;
application.ui.Avatar = Avatar;
application.ui.Thumbnail = Thumbnail;

application.ui.Container = Container;
application.ui.Page = Page;
application.ui.Tabs = Tabs;
application.ui.Tab = Tab;
application.ui.Row = Row;
application.ui.Col = Col;

application.ui.Absolute = Absolute;

application.ui.Display1 = Display1;
application.ui.Display2 = Display2;
application.ui.Headline1 = Headline1;
application.ui.Headline2 = Headline2;
application.ui.Headline3 = Headline3;
application.ui.Headline4 = Headline4;
application.ui.Headline5 = Headline5;
application.ui.Headline6 = Headline6;
application.ui.Text = Text;
application.ui.SearchBox = SearchBox;

application.ui.Icon = Icon;
