import React from 'react';
import { UI } from '@types';
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

const InputComponent = styled(BForm.Control).css`
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
` as UI['Input'];
InputComponent.defaultProps = { size: 'small' };

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
      <InputComponent
        isValid={isValid}
        isInvalid={isInvalid}
        {...props}
        {...field}
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

export {
  Form,
  InputComponent as Input,
  ErrorMessage,
  FormGroup,
  Label,
  Check,
  File,
  StyledInputGroup as InputGroup,
};
