import {
  ComponentType,
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
  ModalBody,
  ModalProps as BModalProps,
  RowProps,
} from 'react-bootstrap';
import { ErrorMessageProps, Formik } from 'formik';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';
import Select, { OptionProps } from 'react-select';
import { SelectComponentsProps } from 'react-select/base';
import { FormCheckInputProps } from 'react-bootstrap/FormCheckInput';
import Dropdown from 'react-bootstrap/Dropdown';
import { ClickHandler } from './_helpers';

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
}

type UIComponent<T = {}> = ComponentType<
  T & { className?: string; defaultProps?: Partial<T & { className: string }> }
>;

export type UI = {
  Form: typeof Formik & {
    Input: UIComponent<FormControlProps & { name: string }>;
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
  Headline2: UIComponent;
  Headline3: UIComponent;
  Headline4: UIComponent;
  Headline5: UIComponent;
  Headline6: UIComponent;
  Img: ComponentType<{ src: string | undefined }>;
  Dropdown: typeof Dropdown;
  Avatar: ComponentType<{
    src: string | undefined;
    size?: 'regular' | 'small' | 'large';
  }>;
  Thumbnail: ComponentType<{
    src: string | undefined;
    size?: 'regular' | 'small' | 'large';
  }>;
  File: typeof FormFile;
  Label: UIComponent<FormLabelProps>;
  FormGroup: UIComponent<FormGroupProps>;
  Input: typeof FormControl;
  Select: typeof Select;
  Option: ComponentType<OptionProps<any>>;
  Check: typeof FormCheck;
  Container: UIComponent<ContainerProps & ClickHandler>;
  Page: UIComponent<ContainerProps>;
  Row: UIComponent<RowProps & ClickHandler>;
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
  Modal: UIComponent<ModalProps>;
  ModalBody: typeof ModalBody;
  Confirm: UIComponent<ConfirmProps>;
};
