import React from 'react';
import { UI } from '@types';
import { Formik, ErrorMessage, useField } from 'formik';
import BFormGroup from 'react-bootstrap/FormGroup';
import BForm from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import styled from '@emotion/styled';
import { inputSizeEnhancer } from './enhancers';
import { Select } from './Select';

// There are 2 type of Form components.
// Standalone component that can be use without Form parent.
// Components connected to the Form, those can't be used without Form.

// Standalone components
const FormGroup = styled<UI['FormGroup']>(BFormGroup)({
  position: 'relative',
});
const Label = BForm.Label;

const InputComponent = styled(BForm.Control)(inputSizeEnhancer, {
  border: 'none',
  '&:empty': {
    background: '#F3F4F5',
    color: 'rgba(47,56,73,0.4)',
  },
  '&:focus': {
    color: '#2F3849',
    boxShadow: 'none',
  },
}) as unknown as UI['Input'];

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

InputGroup.Text = styled(InputGroup.Text)({
  border: 'none',
});

export {
  Form,
  InputComponent as Input,
  ErrorMessage,
  FormGroup,
  Label,
  Check,
  File,
  InputGroup,
};
