import React, { useEffect } from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

import AuthPage from '../components/auth-page';
import RegistrationHero from '../components/registration-hero';

const { useApi } = hooks;
const { Redirect, Link } = components;
const { Form, Button, FormGroup, Headline4, Text, Col, Row } = ui;

const LoginSchema = yup.object().shape({
  password: yup.string().required(),
  email: yup.string().email('Invalid email').required(),
});

const PageLogin = () => {
  const { fetch, loading, response, error } = useApi(requests.login);
  const record = hooks.useActiveUserRecord(null);
  const { value: user, update: updateUser } = record;

  useEffect(() => {
    if (response?.data) {
      updateUser(response.data);
    }
  }, [response, updateUser]);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <AuthPage tips={<RegistrationHero />}>
      <Row>
        <Col>
          <Headline4 className="mt-4">Sign in</Headline4>
          <Text fontSize="extra-small">
            Don’t have an account? <Link to="/register">Sign Up</Link>
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={LoginSchema}
            onSubmit={({ ...user }) => fetch(user)}
          >
            <FormGroup className="pt-4">
              <Form.Input
                size="medium"
                type="email"
                name="email"
                placeholder="Email address"
              />
            </FormGroup>
            <FormGroup className="pt-3">
              <Form.Input
                size="medium"
                type="password"
                name="password"
                placeholder="Password"
              />
            </FormGroup>
            {error && (
              <Text color="error" className="mt-2" weight={400}>
                {error}
              </Text>
            )}
            <FormGroup className="w-100 mt-4">
              <Button stretch type="submit" disabled={loading} className="mb-3">
                Sign in
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>
    </AuthPage>
  );
};

export default PageLogin;
