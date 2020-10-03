import React, { useEffect } from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

const { useApi } = hooks;
const { Redirect } = components;
const { Form, Button, FormGroup, Label } = ui;

const LoginSchema = yup.object().shape({
  password: yup.string().required(),
  email: yup
    .string()
    .email('Invalid email')
    .required(),
});

export default () => {
  const { fetch, loading, response } = useApi(requests.login);
  const [user, updateUser] = hooks.useActiveUserRecord();

  useEffect(() => {
    if (response?.error) {
      alert('Login failed');
      return;
    }
    if (response?.data) {
      updateUser(response.data);
    }
  }, [response, updateUser]);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Form
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={({ ...user }) => fetch(user)}
    >
      <FormGroup>
        <Label>Email</Label>
        <Form.Input type="email" name="email" />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Form.Input type="password" name="password" />
      </FormGroup>
      <FormGroup>
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </FormGroup>
    </Form>
  );
};
