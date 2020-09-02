import { ComponentType, ReactElement, ReactNode } from 'react';
import {
  ColProps,
  ContainerProps,
  FormControlProps,
  FormLabelProps,
  ModalProps as BModalProps,
  RowProps,
} from 'react-bootstrap';
import { ErrorMessageProps, Formik } from 'formik';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormFile from 'react-bootstrap/FormFile';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'regular' | 'danger';
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
}

export type UI = {
  Form: typeof Formik & {
    Input: ComponentType<FormControlProps & { name: string }>;
  };
  Text: ComponentType<TextProps>;
  Display1: ComponentType;
  Display2: ComponentType;
  Headline1: ComponentType;
  Headline2: ComponentType;
  Headline3: ComponentType;
  Headline4: ComponentType;
  File: typeof FormFile;
  Label: ComponentType<FormLabelProps>;
  FormGroup: ComponentType;
  Input: typeof FormControl;
  Check: typeof FormCheck;
  Container: ComponentType<ContainerProps>;
  Page: ComponentType<ContainerProps>;
  Row: ComponentType<RowProps>;
  Col: ComponentType<ColProps>;
  ErrorMessage: ComponentType<ErrorMessageProps>;
  Button: ComponentType<ButtonProps>;
  Modal: ComponentType<ModalProps>;
  Confirm: ComponentType<ConfirmProps>;
};
