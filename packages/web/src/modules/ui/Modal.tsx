import React, {
  ComponentType,
  FunctionComponent,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';
import application from '@application';
import { default as BModal } from 'react-bootstrap/Modal';
import ModalBody from 'react-bootstrap/ModalBody';
import styled from '@emotion/styled';
import { ConfirmProps } from '@types';
import { Button } from './Button';
import Absolute from './Absolute';
import Icon from './Icon';

const ModalProviderContext = React.createContext<
  (renderModal: (close: () => void) => ReactElement) => void
>(() => {});

const Modal = (({ close, ...props }) =>
  (
    <BModal
      onEscapeKeyDown={close}
      {...props}
      dialogClassName={props.fullScreen ? 'full-screen-dialog' : ''}
    >
      {props.children}
      {close && (
        <Absolute
          {...{ [props.fullScreen ? 'left' : 'right']: 25 }}
          top={15}
          onClick={close}
        >
          <Icon type="close" size="large" />
        </Absolute>
      )}
    </BModal>
  ) as unknown) as BModal;

Modal.defaultProps = {
  ...BModal.defaultProps,
  onHide: () => {},
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

const usePromptModal = () => {
  return useContext(ModalProviderContext);
};

const ModalProvider: ComponentType = ({ children }) => {
  const [modal, setModal] = useState<ReactElement | null>(null);
  const promptModal = useCallback(
    (renderModal: (close: () => void) => ReactElement) =>
      setModal(renderModal(() => setModal(null))),
    [setModal],
  );
  return (
    <ModalProviderContext.Provider value={promptModal}>
      {children}
      {modal}
    </ModalProviderContext.Provider>
  );
};

application.ui.Modal = Modal;
application.ui.ModalBody = ModalBody;
application.ui.Confirm = Confirm;
application.hooks.usePromptModal = usePromptModal;
application.services.addProvider(ModalProvider);
