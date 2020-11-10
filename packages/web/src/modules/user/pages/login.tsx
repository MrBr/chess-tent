import React, { useEffect } from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

const { useApi } = hooks;
const { Redirect } = components;
const { Form, Button, FormGroup, Label, Container, Headline1, Card, Text } = ui;

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
    <Container className="h-100 d-flex justify-content-center align-items-center">
      <Card className="px-5 py-5 w-50 m-auto border rounded">
        <div className="d-flex justify-content-between align-items-center">
          <Headline1>Sign In</Headline1>
          <div>
            <Text fontSize="small" className="d-inline">
              Don’t have an account?
            </Text>
            <Text fontSize="small" className="font-weight-bold d-inline ml-1">
              <u>Sign Up</u>
            </Text>
          </div>
        </div>
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
            <Form.Input size="lg" type="email" name="email" />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Form.Input size="lg" type="password" name="password" />
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center mt-4">
            <Text fontSize="small">
              <u>Forgot password?</u>
            </Text>
            <Button type="submit" disabled={loading}>
              Login
            </Button>
          </FormGroup>
        </Form>
      </Card>
    </Container>
  );
};
