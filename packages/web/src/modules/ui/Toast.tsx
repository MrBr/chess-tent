import BToast from 'react-bootstrap/Toast';
import BToastHeader from 'react-bootstrap/ToastHeader';
import ToastBody from 'react-bootstrap/ToastBody';
import styled from '@emotion/styled';
import { UI } from '@types';

const Toast = styled<UI['Toast']>(BToast)({
  maxWidth: 300,
  minWidth: 300,
  backgroundColor: '#FFF',
});

const ToastHeader = styled<UI['ToastHeader']>(BToastHeader)({
  '.close': {
    marginLeft: 'auto !important',
  },
});

export { Toast, ToastBody, ToastHeader };
