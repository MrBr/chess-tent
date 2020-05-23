import { ComponentType, ReactNode } from 'react';
import {
  ButtonProps as BButonProps,
  ModalProps as BModalProps,
} from 'react-bootstrap';

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
  Form: ComponentType;
  FormGroup: ComponentType;
  Button: ComponentType<ButtonProps>;
  Modal: ComponentType<ModalProps>;
  Confirm: ComponentType<ConfirmProps>;
};
