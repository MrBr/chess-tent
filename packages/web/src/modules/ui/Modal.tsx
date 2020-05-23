import React, { FunctionComponent } from 'react';
import { default as BModal } from 'react-bootstrap/Modal';
import styled from '@emotion/styled';
import { ConfirmProps } from '@types';
import { Button } from './Button';

export const Modal = BModal;

export const Confirm = styled<FunctionComponent<ConfirmProps>>(
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
