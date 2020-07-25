import { ComponentType, ReactNode } from 'react';
import {
  ButtonProps as BButonProps,
  FormControlProps,
  FormLabelProps,
  ModalProps as BModalProps,
} from 'react-bootstrap';
import { ErrorMessageProps, Formik } from 'formik';

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
  Form: typeof Formik;
  Label: ComponentType<FormLabelProps>;
  FormGroup: ComponentType;
  Input: ComponentType<FormControlProps & { name: string }>;
  ErrorMessage: ComponentType<ErrorMessageProps>;
  Button: ComponentType<ButtonProps>;
  Modal: ComponentType<ModalProps>;
  Confirm: ComponentType<ConfirmProps>;
};
