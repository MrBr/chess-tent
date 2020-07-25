import React from 'react';
import { Formik, ErrorMessage, useField } from 'formik';
import { default as BFormGroup } from 'react-bootstrap/FormGroup';
import { default as BForm } from 'react-bootstrap/Form';
import styled from '@emotion/styled';
import { UI } from '@types';

const FormGroup = styled(BFormGroup)({
  position: 'relative',
});
const Label = BForm.Label;

const Input: UI['Input'] = props => {
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

const Form: UI['Form'] = props => (
  <Formik {...props}>
    {({ handleSubmit }) => (
      <BForm noValidate onSubmit={handleSubmit}>
        {props.children}
      </BForm>
    )}
  </Formik>
);

export { Form, Input, ErrorMessage, FormGroup, Label };
