import application from '@application';

import './style';
import './utils';

import { Button, ButtonGroup, ToggleButton } from './Button';
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
import { Container, Row, Col } from './Grid';
import { Select, AsyncSelect } from './Select';
import Dropdown, { OptionsDropdown } from './Dropdown';
import { Tooltip } from './Tooltip';
import Badge from './Badge';
import { Overlay, OverlayTrigger } from './Overlay';
import {
  Hero,
  Headline1,
  Headline2,
  Headline3,
  Headline4,
  Headline5,
  Headline6,
  Text,
} from './Text';
import { Avatar, Img, Thumbnail } from './Img';
import Card from './Card';
import CardEmpty from './CardEmpty';
import { Tab, Tabs } from './Tab';
import Icon from './Icon';
import Absolute from './Absolute';
import { Toast, ToastBody, ToastHeader } from './Toast';
import Dot from './Dot';
import LoadMore from './LoadMore';
import Spinner from './Spinner';
import { Slider } from './Slider';
import ProgressBar from './ProgressBar';
import { withFiles } from './hoc';
import { mobileCss } from './enhancers';
import Stack from './Stack';
import Line from './Line';
import Breadcrumbs from './Breadcrumbs';
import Alert from './Alert';

application.hoc.withFiles = withFiles;

application.register(() => import('./Modal'));
application.register(() => import('./Wizard'));
application.register(() => import('./Offcanvas'));

application.ui.FormGroup = FormGroup;
application.ui.Form = Form;
application.ui.Button = Button;
application.ui.ToggleButton = ToggleButton;
application.ui.ButtonGroup = ButtonGroup;
application.ui.Label = Label;
application.ui.Input = Input;
application.ui.InputGroup = InputGroup;
application.ui.File = File;
application.ui.Check = Check;
application.ui.Slider = Slider;
application.ui.ErrorMessage = ErrorMessage;
application.ui.Select = Select;
application.ui.AsyncSelect = AsyncSelect;

application.ui.Toast = Toast;
application.ui.ToastHeader = ToastHeader;
application.ui.ToastBody = ToastBody;

application.ui.Dropdown = Dropdown;
application.ui.OptionsDropdown = OptionsDropdown;

application.ui.Card = Card;
application.ui.CardEmpty = CardEmpty;

application.ui.Img = Img;
application.ui.Avatar = Avatar;
application.ui.Thumbnail = Thumbnail;

application.ui.Container = Container;
application.ui.Breadcrumbs = Breadcrumbs;
application.ui.Tabs = Tabs;
application.ui.Tab = Tab;
application.ui.Row = Row;
application.ui.Col = Col;

application.ui.Absolute = Absolute;

application.ui.Hero = Hero;
application.ui.Headline1 = Headline1;
application.ui.Headline2 = Headline2;
application.ui.Headline3 = Headline3;
application.ui.Headline4 = Headline4;
application.ui.Headline5 = Headline5;
application.ui.Headline6 = Headline6;
application.ui.Text = Text;

application.ui.Tooltip = Tooltip;
application.ui.Overlay = Overlay;
application.ui.OverlayTrigger = OverlayTrigger;
application.ui.Badge = Badge;
application.ui.Alert = Alert;
application.ui.ProgressBar = ProgressBar;

application.ui.Icon = Icon;
application.ui.Dot = Dot;
application.ui.Line = Line;

application.ui.LoadMore = LoadMore;
application.ui.Spinner = Spinner;

application.ui.Stack = Stack;

application.utils.mobileCss = mobileCss;
