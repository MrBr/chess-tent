import React from 'react';
import { Formik, ErrorMessage, useField } from 'formik';
import { default as BFormGroup } from 'react-bootstrap/FormGroup';
import { default as BForm } from 'react-bootstrap/Form';
import styled from '@emotion/styled';
import { UI } from '@types';

// There are 2 type of Form components.
// Standalone component that can be use without Form parent.
// Components connected to the Form, those can't be used without Form.

// Standalone components
const FormGroup = styled(BFormGroup)({
  position: 'relative',
});
const Label = BForm.Label;
const Input = BForm.Control;
const Check = BForm.Check;

// Form connected components
const Form: UI['Form'] = props => (
  <Formik {...props}>
    {({ handleSubmit }) => (
      <BForm noValidate onSubmit={handleSubmit}>
        {props.children}
      </BForm>
    )}
  </Formik>
);

const FormInput: UI['Form']['Input'] = props => {
  const [field, { touched, error }] = useField(props);
  const isValid = !!touched && !error;
  const isInvalid = !!touched && !!error;
  return (
    <>
      <BForm.Control
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

export { Form, Input, ErrorMessage, FormGroup, Label, Check };
