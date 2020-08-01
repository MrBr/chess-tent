import { ComponentType, ReactNode } from 'react';
import {
  ButtonProps as BButonProps,
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

export type ButtonProps = BButonProps & { onClick?: () => void };

export type ModalProps = BModalProps;

export interface ConfirmProps {
  title: ReactNode;
  message?: ReactNode;
  okText: string;
  cancelText: string;
  onOk: () => void;
  onCancel: () => void;
}

export type UI = {
  Form: typeof Formik & {
    Input: ComponentType<FormControlProps & { name: string }>;
  };
  Label: ComponentType<FormLabelProps>;
  FormGroup: ComponentType;
  Input: typeof FormControl;
  Check: typeof FormCheck;
  Container: ComponentType<ContainerProps>;
  Row: ComponentType<RowProps>;
  Col: ComponentType<ColProps>;
  ErrorMessage: ComponentType<ErrorMessageProps>;
  Button: ComponentType<ButtonProps>;
  Modal: ComponentType<ModalProps>;
  Confirm: ComponentType<ConfirmProps>;
};
