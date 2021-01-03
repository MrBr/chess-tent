import { ComponentType, FunctionComponent } from 'react';
import { ContentEditableProps } from './_helpers';

export interface FileUploaderProps {
  openFileDialog: () => void;
  files: File[];
}

export type HtmlProps = Omit<
  ContentEditableProps,
  'dangerouslySetInnerHTML'
> & {
  initialHtml?: string;
};

export interface HOC {
  withFiles: <P extends FileUploaderProps>(
    WrappedComponent: ComponentType<P>,
  ) => FunctionComponent<Omit<P, keyof FileUploaderProps>>;
  withMobile: <P extends {}>(
    DesktopComponent: ComponentType<P>,
    MobileComponent: ComponentType<P>,
  ) => ComponentType<P>;
  withHtml: <P extends HtmlProps>(
    WrappedComponent: ComponentType<P>,
  ) => ComponentType<P>;
}
