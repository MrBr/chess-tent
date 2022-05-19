import React, { ComponentProps, ChangeEventHandler, Ref } from 'react';
import { InputPropsWithSizeEnhancer, UI, UIComponent } from '@types';
import { Formik, ErrorMessage, useField } from 'formik';
import BFormGroup from 'react-bootstrap/FormGroup';
import BForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styled from '@chess-tent/styled-props';
import { inputSizePropStyle } from './enhancers';
import { Select } from './Select';

// There are 2 type of Form components.
// Standalone component that can be use without Form parent.
// Components connected to the Form, those can't be used without Form.

// Standalone components
const FormGroup = styled(BFormGroup).css`
  position: relative;
`;
const Label = BForm.Label;

const InputGroupText = styled(InputGroup.Text).css`
  background: transparent;
  border: 1px solid var(--grey-600-color);
`;

const InputComponent = styled<
  UIComponent<InputPropsWithSizeEnhancer & { innerRef: Ref<HTMLInputElement> }>
>(({ innerRef, size, ...props }) => <BForm.Control {...props} ref={innerRef} />)
  .css`
  border: 1px solid var(--grey-600-color) !important; // !important is for bootstrap focus override
  color: var(--black-color);
  
  &:placeholder-shown {
    background: var(--light-color);
    color: var(--grey-700-color);
  }
  
  &:focus {
    box-shadow: none;
  }
  
  &:disabled {
    background: var(--grey-300-color);
    border: 1px solid var(--grey-600-color);
    cursor: not-allowed;
  }
  
  ${inputSizePropStyle}
`;

const InputWithRef = React.forwardRef<
  HTMLInputElement,
  ComponentProps<UI['Input']>
>((props, ref) => <InputComponent {...props} innerRef={ref} />);

InputWithRef.defaultProps = { size: 'small' };

// datetime-local input requires date string without timezone
// https://stackoverflow.com/a/63138883/2188869
const dateToDatetimeLocal = (dateStamp: string) => {
  return new Date(dateStamp)
    .toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(' ', 'T');
};

const DateTime = ({
  onChange,
  value,
  ...props
}: ComponentProps<UI['DateTime']>) => {
  const onChangeAdapter: ChangeEventHandler<HTMLInputElement> = event => {
    if (!onChange) {
      return;
    }
    const dateTimeWithZone = new Date(event.target.value).toISOString();
    onChange(dateTimeWithZone);
  };

  const formattedValue = value ? dateToDatetimeLocal(value) : undefined;
  return (
    <InputComponent
      {...props}
      value={formattedValue}
      // @ts-ignore
      type="datetime-local"
      onChange={onChangeAdapter}
    />
  );
};

const StyledInputGroup = styled(InputGroup).css`
  ${InputGroupText}:first-child {
    border-right: none !important;
  }
  ${InputGroupText}:last-child {
    border-left: none !important;
  }
  ${InputGroupText} + ${InputComponent as any}{
    border-left: none !important;
  }
  ${InputComponent as any}:not(:last-child) {
    border-right: none !important;
  }
` as typeof InputGroup;
StyledInputGroup.Text = InputGroupText;

const Check = BForm.Check;
const File = (props: any) => <BForm.Control {...props} type="file" />;

// Form connected components
const Form: UI['Form'] = props => (
  <Formik {...props}>
    {formikProps => (
      <BForm noValidate onSubmit={formikProps.handleSubmit}>
        {typeof props.children === 'function'
          ? props.children(formikProps)
          : props.children}
      </BForm>
    )}
  </Formik>
);

const FormSelect: UI['Form']['Select'] = props => {
  const [field, { error }, { setValue }] = useField(props.name); // TODO - force "name"
  return (
    <>
      <Select
        {...props}
        {...field}
        onChange={(option: any) => setValue(option)}
      />
      <BForm.Control.Feedback type="invalid">{error}</BForm.Control.Feedback>
    </>
  );
};
const FormInput: UI['Form']['Input'] = props => {
  const [field, { touched, error }] = useField(props);
  const isValid = !!touched && !error;
  const isInvalid = !!touched && !!error;
  return (
    <>
      <InputWithRef
        isValid={isValid}
        isInvalid={isInvalid}
        {...props}
        {...field}
      />
      <BForm.Control.Feedback type="invalid">{error}</BForm.Control.Feedback>
    </>
  );
};
const FormDateTime: UI['Form']['DateTime'] = ({ onChange, ...props }) => {
  const [field, { touched, error }, { setValue }] = useField(props);
  const isValid = !!touched && !error;
  const isInvalid = !!touched && !!error;
  const onChangeAdapter = (value: string) => {
    setValue(value);
    onChange && onChange(value);
  };
  return (
    <>
      <DateTime
        isValid={isValid}
        isInvalid={isInvalid}
        {...props}
        {...field}
        onChange={onChangeAdapter}
      />
      <BForm.Control.Feedback type="invalid">{error}</BForm.Control.Feedback>
    </>
  );
};
const FormCheck: UI['Form']['Check'] = props => {
  const [field, { touched, error }] = useField(props);
  const isValid = !!touched && !error;
  const isInvalid = !!touched && !!error;
  return (
    <>
      <BForm.Check
        type="checkbox"
        isValid={isValid}
        isInvalid={isInvalid}
        checked={!!field.value}
        {...props}
        {...field}
      />
      <BForm.Control.Feedback type="invalid">{error}</BForm.Control.Feedback>
    </>
  );
};
Form.Input = FormInput;
Form.Select = FormSelect;
Form.Check = FormCheck;
Form.DateTime = FormDateTime;

export {
  Form,
  InputWithRef as Input,
  ErrorMessage,
  FormGroup,
  Label,
  Check,
  File,
  StyledInputGroup as InputGroup,
};
