import { ComponentType, FunctionComponent } from 'react';
import { withRouter } from 'react-router-dom';

export interface FileUploaderProps {
  openFileDialog: () => void;
  files: File[];
}

export interface HOC {
  withFiles: <P extends FileUploaderProps>(
    WrappedComponent: ComponentType<P>,
  ) => FunctionComponent<Omit<P, keyof FileUploaderProps>>;
  withMobile: <P extends {}>(
    DesktopComponent: ComponentType<P>,
    MobileComponent: ComponentType<P>,
  ) => ComponentType<P>;
  withRouter: typeof withRouter;
}
