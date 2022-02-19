import {
  ComponentProps,
  ComponentType,
  ImgHTMLAttributes,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  RefObject,
  ElementType,
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
  Modal as BModal,
  RowProps,
  Tab,
  Tabs,
  ToastBody,
  ToastProps,
  ToastHeaderProps,
  Nav,
  Navbar,
  NavDropdown,
  CardProps,
  TooltipProps,
  Overlay as BOverlay,
  OverlayTrigger as BOverlayTrigger,
  BadgeProps,
  SpinnerProps,
  ProgressBarProps,
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
import { ClassNameProps, ClickProps } from './_helpers';
import { AsyncSelect } from '../../modules/ui/Select';
import { HtmlProps } from './hoc';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'regular' | 'danger' | 'ghost' | 'dark';
  size?: 'large' | 'regular' | 'small' | 'extra-small';
  type?: 'button' | 'reset' | 'submit';
  disabled?: boolean;
  stretch?: boolean;
} & { onClick?: () => void; ref?: RefObject<HTMLButtonElement> };

export type ModalProps = BModalProps;

export interface ConfirmProps {
  title: ReactNode;
  message?: ReactNode;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
}

type FontSize = 'base' | 'small' | 'extra-small' | 'large';

export type TextProps = {
  children?: ReactNode | ReactElement[];
  className?: string;
  inline?: boolean;
  weight?: number;
  inherit?: boolean;
  fontSize?: FontSize;
  align?: 'center' | 'left' | 'right';
  color?: 'primary' | 'secondary' | 'title' | 'inherit' | 'light';

  onClick?: ReactEventHandler;
  onPaste?: ReactEventHandler;
  as?: ElementType;
} & HtmlProps;

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

export type FormElementsSize = 'large' | 'regular' | 'small' | 'extra-small';
export interface OptionsDropdownProps<T> {
  id: string;
  className?: string;
  children?: never;
  label: string;
  values: SelectOption<T>[];
  initial?: T;
  onChange: (value?: T) => void;
  size?: FormElementsSize;
}

export type UIComponent<T = {}> = ComponentType<
  T & {
    className?: string;
    defaultProps?: Partial<T & { className: string }>;
  } & ClickProps
>;

export interface LoadMoreProps {
  className?: string;
  loadMore: () => void;
  loading: boolean;
  noMore: boolean;
}

type InputPropsWithSizeEnhancer = Omit<
  ComponentProps<typeof FormControl>,
  'size'
> & {
  size?: FormElementsSize;
};

export type UI = {
  Form: typeof Formik & {
    Input: UIComponent<
      InputPropsWithSizeEnhancer & {
        rows?: number;
        name: string;
        placeholder?: string;
      }
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
  Hero: UIComponent<TextProps>;
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
      | 'board'
      | 'like'
      | 'edit'
      | 'hamburger'
      | 'chess'
      | 'chat'
      | 'code'
      | 'cursor'
      | 'support'
      | 'show'
      | 'hide'
      | 'gift'
      | 'king'
      | 'pawn'
      | 'price'
      | 'settings'
      | 'video';
    textual?: boolean;
    size?: 'large' | 'regular' | 'small' | 'extra-small';
    variant?: 'primary' | 'secondary' | 'black' | 'grey-700' | 'light';
    background?: boolean;
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
        size?: Omit<FormElementsSize, 'large'>;
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
  Avatar: UIComponent<{
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
  Input: ComponentType<InputPropsWithSizeEnhancer>;
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
  Dot: UIComponent<{ background?: string }>;
  LoadMore: UIComponent<LoadMoreProps>;
  Spinner: UIComponent<SpinnerProps>;
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
  Card: ComponentType<ClickProps & ClassNameProps & CardProps>;
  CardBody: ComponentType<ClassNameProps>;
  CardHeader: ComponentType;
  Modal: UIComponent<
    ModalProps & { close?: () => void; fullScreen?: boolean }
  > & {
    Header: BModal['Header'];
    Body: BModal['Body'];
    Footer: BModal['Footer'];
    Dialog: BModal['Dialog'];
  };
  ModalBody: typeof ModalBody;
  Confirm: UIComponent<ConfirmProps>;
  Toast: ComponentType<ToastProps>;
  ToastBody: ComponentType<ComponentProps<typeof ToastBody>>;
  ToastHeader: ComponentType<ToastHeaderProps>;
  Nav: typeof Nav;
  Navbar: typeof Navbar;
  NavDropdown: typeof NavDropdown;
  Tooltip: UIComponent<TooltipProps>;
  Overlay: typeof BOverlay;
  OverlayTrigger: typeof BOverlayTrigger;
  Tag: UIComponent<BadgeProps>;
  ProgressBar: UIComponent<ProgressBarProps>;
};
