import { ComponentType, FunctionComponent } from 'react';

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
}
