import React, {
  ChangeEvent,
  ComponentType,
  RefObject,
  useCallback,
  useRef,
  useState,
  ComponentProps,
  UIEvent,
} from 'react';
import { FileUploaderProps, HOC } from '@types';
import { debounce } from 'lodash';
import { File } from './Form';

export const withFiles =
  <P extends FileUploaderProps>(WrappedComponent: ComponentType<P>) =>
  (props: Omit<P, keyof FileUploaderProps>) => {
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
        <File
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFilesChange}
        />
        <WrappedComponent
          {...(props as P)}
          files={files}
          openFileDialog={openFileDialog}
        />
      </>
    );
  };

export const withHtml: HOC['withHtml'] = WrappedComponent => {
  // NOTE
  // The big issue with using contentEditable is dynamic html change (change in props).
  // It resets the caret position to the beginning. Specially annoying UX when editing HTML.
  // Most of the logic here is dealing with the issue
  class WithHtml extends React.Component<
    ComponentProps<typeof WrappedComponent>
  > {
    ref: React.RefObject<HTMLDivElement>;

    constructor(props: ComponentProps<typeof WrappedComponent>) {
      super(props);
      this.ref = React.createRef();
    }

    shouldComponentUpdate(nextProps: ComponentProps<typeof WrappedComponent>) {
      // A BIT SUSPICIOUS!!!
      // If causes any trouble, gotta check all other props as well
      // Changes outside the content should be ignored?
      if (
        this.ref.current?.innerHTML &&
        this.ref.current.innerHTML === nextProps.html
      ) {
        return false;
      }

      return !!this.props.children;
    }

    onInput = (e: UIEvent<HTMLDivElement>) =>
      this.onInputDebounced(e.currentTarget.innerHTML);

    onInputDebounced = debounce(
      (html: string) => {
        const { onInput } = this.props;
        onInput && onInput(html);
      },
      500,
      { trailing: true },
    );

    render() {
      const { contentEditable, html, formatInput, ...props } = this.props;
      if (contentEditable || html) {
        //children aren't actually used here
        return (
          // eslint-disable-next-line
          <div
            {...props}
            children={undefined}
            dangerouslySetInnerHTML={{ __html: html as string }}
            ref={this.ref}
            onInput={this.onInput}
            contentEditable
            suppressContentEditableWarning
          />
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return WithHtml;
};
