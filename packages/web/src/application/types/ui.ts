import {
  ComponentProps,
  ComponentType,
  ImgHTMLAttributes,
  ReactElement,
  ReactEventHandler,
  ReactNode,
  RefObject,
  ElementType,
  RefCallback,
  ForwardedRef,
} from 'react';
import {
  ColProps,
  ContainerProps,
  FormControlProps,
  FormGroupProps,
  FormLabelProps,
  FormCheckProps,
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
  CardImgProps,
  BreadcrumbItemProps,
} from 'react-bootstrap';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import { ErrorMessageProps, Formik, FormikProps as FFormikProps } from 'formik';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import type {
  Props as SelectProps,
  GroupBase,
  SingleValue,
} from 'react-select';
import type { AsyncProps as AsyncSelectProps } from 'react-select/async';
import Dropdown from 'react-bootstrap/Dropdown';
import { ClickProps } from './_helpers';
import { HtmlProps } from './hoc';

export type UISelectProps = {
  icon?: Icons;
  hideDropdownIndicator?: boolean;
  hideMenu?: boolean;
};

export type BaseButtonProps = {
  variant?:
    | 'primary'
    | 'secondary'
    | 'regular'
    | 'danger'
    | 'ghost'
    | 'dark'
    | 'text';
  size?: 'large' | 'regular' | 'small' | 'extra-small';
  disabled?: boolean;
  stretch?: boolean;
};

export type ButtonProps = BaseButtonProps & {
  onClick?: ReactEventHandler;
  ref?: RefObject<HTMLButtonElement>;
  type?: 'button' | 'reset' | 'submit';
};

export type ToggleButtonProps = BaseButtonProps & {
  checked?: boolean;
  defaultChecked?: boolean;
  value?: string | number | readonly string[];
  onChange?: ReactEventHandler;
  onClick?: ReactEventHandler;
  id?: string;
  name?: string;
  type?: 'checkbox' | 'radio';
};

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

export type SearchBoxValueOption = {
  value: number;
  type?: string;
  prefix?: ReactNode;
  label: string;
};
export interface SearchBoxProps {
  children?: never;
  onSearch: (value: SingleValue<SearchBoxValueOption>) => void;
  types?: { type: string; prefix: ReactNode }[];
}

export interface SelectOption<T> {
  value?: T;
  label: string;
  toString?: (value: T) => string;
}

export type FormElementsSize = 'medium' | 'small';

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
    ref?: RefObject<any> | null | RefCallback<any>;
  } & ClickProps
>;

export interface LoadMoreProps {
  className?: string;
  loadMore: () => void;
  loading: boolean;
  noMore: boolean;
}

export type FormikProps<T> = FFormikProps<T>;

type InputPropsWithSizeEnhancer = Omit<
  ComponentProps<typeof FormControl>,
  'size'
> & {
  size?: FormElementsSize;
};

export type Icons =
  | 'add'
  | 'addFilled'
  | 'advanced'
  | 'analysis'
  | 'down'
  | 'back'
  | 'forward'
  | 'left'
  | 'leftLong'
  | 'right'
  | 'rightLong'
  | 'up'
  | 'barChart'
  | 'beginner'
  | 'board'
  | 'boardSimple'
  | 'camera'
  | 'check'
  | 'chess'
  | 'clear'
  | 'close'
  | 'code'
  | 'collapse'
  | 'comment'
  | 'compass'
  | 'contacts'
  | 'conversation'
  | 'copy'
  | 'crown'
  | 'cursor'
  | 'cut'
  | 'dashboard'
  | 'remove'
  | 'document'
  | 'edit'
  | 'editFilled'
  | 'enter'
  | 'exercise'
  | 'exit'
  | 'expand'
  | 'hide'
  | 'show'
  | 'gift'
  | 'hamburger'
  | 'headphone'
  | 'home'
  | 'infoFilled'
  | 'info'
  | 'intermediate'
  | 'king'
  | 'lightbulb'
  | 'like'
  | 'logo'
  | 'mastery'
  | 'message'
  | 'micSmall'
  | 'micOn'
  | 'micOff'
  | 'microphone'
  | 'more'
  | 'moreVertical'
  | 'move'
  | 'notifications'
  | 'notificationsFill'
  | 'pause'
  | 'pawn'
  | 'play'
  | 'plus'
  | 'price'
  | 'personal'
  | 'profile'
  | 'published'
  | 'refresh'
  | 'rotate'
  | 'schedule'
  | 'search'
  | 'settings'
  | 'settingsFilled'
  | 'signout'
  | 'stack'
  | 'starFill'
  | 'starHalf'
  | 'star'
  | 'stop'
  | 'stopFill'
  | 'support'
  | 'team'
  | 'template'
  | 'time'
  | 'invite'
  | 'video'
  | 'videoCamera'
  | 'volume';

export type UI = {
  Form: typeof Formik & {
    Input: UIComponent<
      InputPropsWithSizeEnhancer & {
        rows?: number;
        name: string;
        placeholder?: string;
      }
    >;
    Check: UIComponent<FormCheckProps & { name: string } & FormControlProps>;
    Select: <T, M extends boolean>(
      props: SelectProps<T, M> & { name: string } & UISelectProps,
    ) => ReactElement;
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
    type: Icons;
    textual?: boolean;
    size?: 'large' | 'regular' | 'small' | 'extra-small';
    variant?: 'primary' | 'secondary' | 'black' | 'grey-700' | 'light';
    background?: boolean;
    innerRef?: ForwardedRef<HTMLElement | null>;
  }>;
  Img: ComponentType<
    {
      src: string | undefined;
      className?: string;
      style?: {};
    } & ImgHTMLAttributes<unknown>
  >;
  Dropdown: ComponentType<ComponentProps<typeof Dropdown>> & {
    Toggle: ComponentType<
      Omit<ComponentProps<typeof DropdownToggle>, 'size'> & {
        size?: Omit<FormElementsSize, 'large'>;
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
    className?: string;
  }>;
  Thumbnail: ComponentType<{
    src: string | undefined;
    size?: 'regular' | 'small' | 'large' | 'extra-small';
  }>;
  File: UIComponent<FormControlProps>;
  Label: UIComponent<FormLabelProps>;
  FormGroup: UIComponent<FormGroupProps>;
  Input: ComponentType<InputPropsWithSizeEnhancer>;
  InputGroup: typeof InputGroup;
  Select: <T, M extends boolean>(
    props: SelectProps<T, M> & UISelectProps,
  ) => ReactElement;
  AsyncSelect: <T, M extends boolean, G extends GroupBase<any>>(
    props: AsyncSelectProps<T, M, G> & UISelectProps,
  ) => ReactElement;
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
  Line: UIComponent;
  LoadMore: UIComponent<LoadMoreProps>;
  Spinner: UIComponent<SpinnerProps>;
  Page: UIComponent<ContainerProps>;
  Breadcrumbs: UIComponent & { Item: ComponentType<BreadcrumbItemProps> };
  Tabs: typeof Tabs;
  Tab: typeof Tab;
  Row: UIComponent<RowProps>;
  Col: UIComponent<ColProps>;
  Offcanvas: UIComponent<{
    show?: boolean;
    placement?: 'end';
    onHide: () => void;
  }> & {
    Body: UIComponent;
    Header: UIComponent<{ closeButton?: boolean }>;
  };
  ErrorMessage: UIComponent<ErrorMessageProps>;
  Button: UIComponent<ButtonProps>;
  Stack: UIComponent;
  ToggleButton: UIComponent<ToggleButtonProps>;
  ButtonGroup: UIComponent;
  Card: UIComponent<CardProps> & {
    Body: UIComponent;
    Header: UIComponent;
    Img: UIComponent<CardImgProps>;
  };
  Modal: UIComponent<
    ModalProps & { close?: () => void; fullScreen?: boolean }
  > & {
    Header: typeof BModal['Header'];
    Body: typeof BModal['Body'];
    Footer: typeof BModal['Footer'];
    Dialog: typeof BModal['Dialog'];
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

  /* Molecules */
  CardEmpty: UIComponent<{
    title: string;
    subtitle: string;
    cta: string;
    onClick?: () => void;
    icon: Icons;
  }>;
};
