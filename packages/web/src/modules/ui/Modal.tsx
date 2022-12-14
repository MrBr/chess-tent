import React, { FunctionComponent } from 'react';
import application from '@application';
import { default as BModal } from 'react-bootstrap/Modal';
import { ConfirmProps } from '@types';
import styled, { css } from '@chess-tent/styled-props';

import { Button } from './Button';
import Absolute from './Absolute';
import Icon from './Icon';

const { className: contentClassName } = css`
  border: 0;
  border-radius: 16px;
  max-height: calc(100vh - 50px);
`;

const { className: backdropClassName } = css`
  opacity: 0.2;
  background-color: var(--black-color);
`;

const { className: fullScreenDialogClassName } = css`
  max-width: none;
  width: 100%;
  height: 100%;
  margin: 0;
  transition: none !important;

  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const Modal = (({ close, fullScreen, ...props }) =>
  (
    <BModal
      {...props}
      onHide={close}
      dialogClassName={`${props.dialogClassName || ''} ${
        fullScreen ? fullScreenDialogClassName : ''
      }`}
      contentClassName={`${contentClassName} ${props.contentClassName || ''}`}
      backdropClassName={`${backdropClassName} ${
        props.backdropClassName || ''
      }`}
    >
      {props.children}
      {close && (
        <Absolute
          {...{ [fullScreen ? 'left' : 'right']: 25 }}
          top={15}
          onClick={close}
        >
          <Icon type="close" size="small" />
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
Modal.Body = styled(BModal.Body).css`
  height: 100%;
  overflow: auto;
`;
Modal.Footer = BModal.Footer;
Modal.Dialog = BModal.Dialog;

const Confirm: FunctionComponent<ConfirmProps> = ({
  title,
  message,
  okText,
  cancelText,
  onOk,
  onCancel,
  autoClose,
}) => (
  <>
    <Modal.Header>{title}</Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button
        onClick={() => {
          onOk();
          autoClose && autoClose();
        }}
        size="extra-small"
        variant="secondary"
      >
        {okText}
      </Button>
      <Button
        onClick={() => {
          onCancel();
          autoClose && autoClose();
        }}
        size="extra-small"
        variant="tertiary"
      >
        {cancelText}
      </Button>
    </Modal.Footer>
  </>
);

application.ui.Modal = Modal;
application.ui.Confirm = Confirm;
