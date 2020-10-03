import { ComponentType, FunctionComponent } from 'react';

export interface FileUploaderProps {
  openFileDialog: () => void;
  files: File[];
}

export interface HOC {
  withFiles: <P extends FileUploaderProps>(
    WrappedComponent: ComponentType<P>,
  ) => FunctionComponent<Omit<P, keyof FileUploaderProps>>;
}
