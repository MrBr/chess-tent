import ReactDOM from 'react-dom';
import { FunctionComponent } from 'react';
import { constants } from '@application';

const { MOBILE_ROOT_KEY } = constants;

const MobilePortal: FunctionComponent = ({ children }) => {
  const mobileRoot = document.getElementById(MOBILE_ROOT_KEY);

  if (!mobileRoot) {
    throw new Error('Missing Mobile Root!');
  }

  return ReactDOM.createPortal(children, mobileRoot);
};

export default MobilePortal;
