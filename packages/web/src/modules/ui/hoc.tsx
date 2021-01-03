import React, {
  ChangeEvent,
  ComponentType,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { FileUploaderProps, HOC } from '@types';
import { File } from './Form';

export const withFiles = <P extends FileUploaderProps>(
  WrappedComponent: ComponentType<P>,
) => (props: Omit<P, keyof FileUploaderProps>) => {
  const fileInputRef = useRef() as RefObject<HTMLInputElement>;
  const [files, setFiles] = useState<FileList | []>([]);
  const handleFilesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        setFiles(event.target.files);
      }
    },
    [setFiles],
  );
  const openFileDialog = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [fileInputRef]);

  return (
    <>
      <File>
        <File.Input
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFilesChange}
        />
      </File>
      <WrappedComponent
        {...(props as P)}
        files={files}
        openFileDialog={openFileDialog}
      />
    </>
  );
};

export const withHtml: HOC['withHtml'] = WrappedComponent => props => {
  const defaultValueRef = useRef(props.initialHtml);
  if (props.contentEditable) {
    //children aren't actually used here
    return (
      // eslint-disable-next-line
      <WrappedComponent
        {...props}
        dangerouslySetInnerHTML={{ __html: defaultValueRef.current }}
        children={undefined}
      />
    );
  }
  return <WrappedComponent {...props} />;
};
