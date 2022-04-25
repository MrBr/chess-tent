import React, { FunctionComponent } from 'react';
import application from '@application';
import { default as BModal } from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import styled from '@emotion/styled';
import { ConfirmProps } from '@types';
import { Button } from './Button';
import Absolute from './Absolute';
import Icon from './Icon';

const Modal = (({ close, fullScreen, ...props }) =>
  (
    <BModal
      {...props}
      onHide={close}
      dialogClassName={fullScreen ? 'full-screen-dialog' : ''}
    >
      {props.children}
      {close && (
        <Absolute
          {...{ [fullScreen ? 'left' : 'right']: 25 }}
          top={15}
          onClick={close}
        >
          <Icon type="close" size="large" />
        </Absolute>
      )}
    </BModal>
  ) as unknown) as typeof BModal;

Modal.defaultProps = {
  ...BModal.defaultProps,
  onHide: () => {},
  show: true,
};
Modal.Header = BModal.Header;
Modal.Body = BModal.Body;
Modal.Footer = BModal.Footer;
Modal.Dialog = BModal.Dialog;

const Confirm = styled<FunctionComponent<ConfirmProps>>(
  ({ title, message, okText, cancelText, onOk, onCancel }) => (
    <>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onOk}>{okText}</Button>
        <Button onClick={onCancel}>{cancelText}</Button>
      </Modal.Footer>
    </>
  ),
)({});

application.ui.Modal = Modal;
application.ui.ModalBody = ModalBody;
application.ui.Confirm = Confirm;
