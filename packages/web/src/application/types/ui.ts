import {
  ComponentProps,
  ComponentType,
  ImgHTMLAttributes,
  ReactElement,
  ReactEventHandler,
  ReactNode,
} from 'react';
import {
  ColProps,
  ContainerProps,
  FormControlProps,
  FormGroupProps,
  FormLabelProps,
  InputGroup,
  ModalBody,
  ModalProps as BModalProps,
  RowProps,
  Tab,
  Tabs,
  ToastBody,
  ToastProps,
  ToastHeaderProps,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import { ErrorMessageProps, Formik } from 'formik';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import Select from 'react-select';
import { SelectComponentsProps } from 'react-select/base';
import { FormCheckInputProps } from 'react-bootstrap/FormCheckInput';
import Dropdown from 'react-bootstrap/Dropdown';
import { ClassNameProps, ClickProps, ContentEditableProps } from './_helpers';
import { AsyncSelect } from '../../modules/ui/Select';

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

type FontSize =
  | 'base'
  | 'small'
  | 'extra-small'
  | 'display1'
  | 'display2'
  | 'headline1'
  | 'headline2'
  | 'headline3'
  | 'headline4'
  | 'headline5'
  | 'headline6';

export type TextProps = {
  children?: ReactNode | ReactElement[];
  className?: string;
  inline?: boolean;
  weight?: number;
  align?: 'center' | 'left' | 'right';
  color?: 'title' | 'subtitle' | 'alt' | 'alt-title' | 'alt-subtitle';
  fontSize?: FontSize;
  onClick?: ReactEventHandler;
} & ContentEditableProps;

export declare interface SearchBoxProps {
  children?: never;
  onSearch: (text: string) => void;
  debounce: number;
}

export interface SelectOption<T> {
  value?: T;
  label: string;
  toString?: (value: T) => string;
}

export type DropdownSize = 'regular' | 'small' | 'extra-small';
export interface OptionsDropdownProps<T> {
  id: string;
  className?: string;
  children?: never;
  label: string;
  values: SelectOption<T>[];
  initial?: T;
  onChange: (value?: T) => void;
  size?: DropdownSize;
}

export type UIComponent<T = {}> = ComponentType<
  T & {
    className?: string;
    defaultProps?: Partial<T & { className: string }>;
  } & ClickProps
>;

export type UI = {
  Form: typeof Formik & {
    Input: UIComponent<
      FormControlProps & { rows?: number; name: string; placeholder?: string }
    >;
    Check: UIComponent<
      FormCheckInputProps & { name: string } & FormControlProps
    >;
    Select: UIComponent<
      Omit<FormControlProps, 'value'> & {
        name: string;
      } & SelectComponentsProps
    >;
  };
  SearchBox: UIComponent<SearchBoxProps>;
  Text: UIComponent<TextProps>;
  Display1: UIComponent<TextProps>;
  Display2: UIComponent<TextProps>;
  Headline1: UIComponent<TextProps>;
  Headline2: UIComponent<TextProps>;
  Headline3: UIComponent<TextProps>;
  Headline4: UIComponent<TextProps>;
  Headline5: UIComponent<TextProps>;
  Headline6: UIComponent<TextProps>;
  Icon: UIComponent<{
    type:
      | 'close'
      | 'comment'
      | 'notification'
      | 'search'
      | 'home'
      | 'crown'
      | 'plus'
      | 'chess';
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
  Dropdown: ComponentType<ComponentProps<typeof Dropdown>> & {
    Toggle: ComponentType<
      Omit<ComponentProps<typeof DropdownToggle>, 'size'> & {
        size?: DropdownSize;
        collapse?: boolean;
      }
    >;
    Menu: ComponentType<
      ComponentProps<typeof Dropdown['Menu']> & {
        width?: string | number;
      }
    >;
    Item: typeof Dropdown['Item'];
    Divider: typeof Dropdown['Divider'];
    Header: typeof Dropdown['Header'];
  };
  OptionsDropdown: ComponentType<OptionsDropdownProps<any>>;
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
  AsyncSelect: typeof AsyncSelect;
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
  CardHeader: ComponentType;
  Modal: UIComponent<ModalProps & { close?: () => void; fullScreen?: boolean }>;
  ModalBody: typeof ModalBody;
  Confirm: UIComponent<ConfirmProps>;
  Toast: ComponentType<ToastProps>;
  ToastBody: ComponentType<ComponentProps<typeof ToastBody>>;
  ToastHeader: ComponentType<ToastHeaderProps>;
  Nav: typeof Nav;
  Navbar: typeof Navbar;
  NavDropdown: typeof NavDropdown;
};
