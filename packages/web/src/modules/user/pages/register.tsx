import React from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

const { useApi } = hooks;
const { Redirect } = components;
const { Form, Button, FormGroup, Label } = ui;

const SignupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required(),
  password: yup
    .string()
    .min(8, 'Too Short!')
    .max(24, 'Too Long!')
    .required(),
  passwordConfirmation: yup.string().when('password', {
    is: val => val && val.length > 0,
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'Both passwords need to be the same')
      .required(),
  }),
  nickname: yup
    .string()
    .min(4, 'Too Short!')
    .max(16, 'Too Long!')
    .required(),
  email: yup
    .string()
    .email('Invalid email')
    .required(),
  coach: yup.boolean(),
});

export default () => {
  const { fetch, loading, response } = useApi(requests.register);
  if (response && !response.error) {
    return <Redirect to="/" />;
  }
  return (
    <Form
      initialValues={{
        email: '',
        password: '',
        nickname: '',
        name: '',
        passwordConfirmation: '',
      }}
      validationSchema={SignupSchema}
      // Omitting passwordConfirmation
      onSubmit={({ passwordConfirmation, ...user }) => fetch(user)}
    >
      <FormGroup>
        <Label>Name</Label>
        <Form.Input type="text" name="name" />
      </FormGroup>
      <FormGroup>
        <Label>Nickname</Label>
        <Form.Input type="text" name="nickname" />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Form.Input type="email" name="email" />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Form.Input type="password" name="password" />
      </FormGroup>
      <FormGroup>
        <Label>Repeat password</Label>
        <Form.Input type="password" name="passwordConfirmation" />
      </FormGroup>
      <FormGroup>
        <Label>Coach</Label>
        <Form.Check name="coach" />
      </FormGroup>
      <FormGroup>
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </FormGroup>
    </Form>
  );
};
