import {
  ComponentProps,
  ComponentType,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  ImgHTMLAttributes,
} from 'react';
import {
  ColProps,
  ContainerProps,
  FormControlProps,
  FormGroupProps,
  FormLabelProps,
  ModalBody,
  ModalProps as BModalProps,
  RowProps,
  Tabs,
  Tab,
  InputGroup,
} from 'react-bootstrap';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import { ErrorMessageProps, Formik } from 'formik';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import Select, { OptionProps } from 'react-select';
import { SelectComponentsProps } from 'react-select/base';
import { FormCheckInputProps } from 'react-bootstrap/FormCheckInput';
import Dropdown from 'react-bootstrap/Dropdown';
import { ClassNameProps, ClickProps, ContentEditableProps } from './_helpers';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'regular' | 'danger' | 'ghost';
  size?: 'large' | 'regular' | 'small' | 'extra-small';
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
} & { onClick?: () => void };

export type ModalProps = BModalProps;

export interface ConfirmProps {
  title: ReactNode;
  message?: ReactNode;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
}

type FontSize = 'base' | 'small' | 'extra-small';

export declare interface TextProps {
  children: ReactNode | ReactElement[];
  className?: string;
  inline?: boolean;
  weight?: number;
  align?: 'center' | 'left' | 'right';
  fontSize?: FontSize;
  onClick?: ReactEventHandler;
  contentEditable?: boolean;
}

export type UIComponent<T = {}> = ComponentType<
  T & {
    className?: string;
    defaultProps?: Partial<T & { className: string }>;
  } & ClickProps
>;
type D = ComponentType<ComponentProps<typeof Dropdown>> & {
  Toggle: ComponentType<
    Omit<ComponentProps<typeof DropdownToggle>, 'size'> & {
      size?: 'regular' | 'small' | 'extra-small';
    }
  >;
  Menu: typeof Dropdown['Menu'];
  Item: typeof Dropdown['Item'];
  Divider: typeof Dropdown['Divider'];
  Header: typeof Dropdown['Header'];
};

export type UI = {
  Form: typeof Formik & {
    Input: UIComponent<FormControlProps & { rows?: number; name: string }>;
    Check: UIComponent<FormCheckInputProps & { name: string }>;
    Select: UIComponent<
      Omit<FormControlProps, 'value'> & {
        name: string;
      } & SelectComponentsProps
    >;
  };
  Text: UIComponent<TextProps>;
  Display1: UIComponent;
  Display2: UIComponent;
  Headline1: UIComponent;
  Headline2: UIComponent<ContentEditableProps>;
  Headline3: UIComponent;
  Headline4: UIComponent;
  Headline5: UIComponent;
  Headline6: UIComponent;
  Icon: UIComponent<{
    type: 'close' | 'comment';
    textual?: boolean;
    size?: 'large' | 'regular';
  }>;
  Img: ComponentType<
    {
      src: string | undefined;
      className?: string;
      style?: {};
    } & ImgHTMLAttributes<unknown>
  >;
  FramedProfile: ComponentType<{ src: string | undefined }>;
  Dropdown: D;
  Avatar: ComponentType<{
    src: string | undefined;
    size?: 'regular' | 'small' | 'large' | 'extra-small';
    onClick?: ReactEventHandler;
    name?: string;
  }>;
  Thumbnail: ComponentType<{
    src: string | undefined;
    size?: 'regular' | 'small' | 'large' | 'extra-small';
  }>;
  File: typeof FormFile;
  Label: UIComponent<FormLabelProps>;
  FormGroup: UIComponent<FormGroupProps>;
  Input: typeof FormControl;
  InputGroup: typeof InputGroup;
  Select: typeof Select;
  Option: ComponentType<OptionProps<any>>;
  Check: typeof FormCheck;
  Container: UIComponent<ContainerProps>;
  Absolute: UIComponent<{
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    zIndex?: number;
  }>;
  Page: UIComponent<ContainerProps>;
  Tabs: typeof Tabs;
  Tab: typeof Tab;
  Row: UIComponent<RowProps>;
  Col: UIComponent<ColProps>;
  ErrorMessage: UIComponent<ErrorMessageProps>;
  Button: UIComponent<ButtonProps>;
  ToggleButton: UIComponent<
    ButtonProps & {
      checked?: boolean;
      defaultChecked?: boolean;
      value?: string | number;
      onChange?: ReactEventHandler;
    }
  >;
  Card: ComponentType<ClickProps & ClassNameProps>;
  CardBody: ComponentType;
  Modal: UIComponent<ModalProps>;
  ModalBody: typeof ModalBody;
  Confirm: UIComponent<ConfirmProps>;
};
