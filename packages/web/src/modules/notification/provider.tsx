import React, {
  ComponentType,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import { ui } from '@application';
import { Services } from '@types';

const { Toast, Absolute } = ui;

let pushToastToProvider: Services['pushToast'];
export const pushToast = (toast: ReactElement) => pushToastToProvider(toast);

export const ToastProvider: ComponentType = ({ children }) => {
  const [toasts, setToasts] = useState<ReactElement[]>([]);
  pushToastToProvider = useCallback(
    // This is bit iffy!!;
    (toast: ReactElement) => setToasts([toast, ...toasts]),
    [toasts, setToasts],
  );
  return (
    <>
      <Absolute right={50} top={110} zIndex={100}>
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            onClose={() => setToasts(toasts.filter((item, i) => i !== index))}
            autohide
            delay={15000}
          >
            {toast}
          </Toast>
        ))}
      </Absolute>
      {children}
    </>
  );
};
