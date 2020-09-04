import React, {
  ComponentType,
  FunctionComponent,
  ReactElement,
  useContext,
  useState,
} from 'react';
import application from '@application';
import { default as BModal } from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import styled from '@emotion/styled';
import { ConfirmProps } from '@types';
import { Button } from './Button';

const ModalProviderContext = React.createContext<
  (modalContent: ReactElement) => void
>(() => {});

const Modal = BModal;
// @ts-ignore
Modal.defaultProps = {
  onHide: console.log,
};

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

const usePromptModal = () => {
  return useContext(ModalProviderContext);
};

const ModalProvider: ComponentType = ({ children }) => {
  const [modal, setModal] = useState<ReactElement | null>(null);
  return (
    <ModalProviderContext.Provider value={setModal}>
      {children}
      {modal && (
        <Modal show onEscapeKeyDown={() => setModal(null)}>
          {modal}
        </Modal>
      )}
    </ModalProviderContext.Provider>
  );
};

application.ui.Modal = Modal;
application.ui.ModalBody = ModalBody;
application.ui.Confirm = Confirm;
application.hooks.usePromptModal = usePromptModal;
application.services.addProvider(ModalProvider);
