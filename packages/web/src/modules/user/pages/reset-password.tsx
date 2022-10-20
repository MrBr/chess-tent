import React from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

import AuthPage from '../components/auth-page';
import RegistrationFooter from '../components/registration-footer';
import RegistrationHeader from '../components/registration-header';
import RegistrationHero from '../components/registration-hero';

const { useApi, useActiveUserRecord, useQuery } = hooks;
const { Text, Form, Button, FormGroup, Label, Col, Row } = ui;
const { Redirect, Link } = components;

const ResetPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required(),
  password: yup.string().min(8, 'Too Short!').max(24, 'Too Long!').required(),
});

const PageResetPassword = () => {
  const { fetch, loading, response, error } = useApi(requests.resetPassword);
  const { value: activeUser } = useActiveUserRecord<null>();
  const { resetToken } = useQuery<{ resetToken: string }>();

  if (activeUser) {
    return <Redirect to="/" />;
  }

  const handleSubmit = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    fetch({
      email,
      password,
      token: resetToken,
    });
  };

  let content = (
    <>
      <FormGroup>
        <Form.Input
          className="mt-4"
          size="medium"
          type="email"
          name="email"
          placeholder="Email"
        />
      </FormGroup>
      <FormGroup>
        <Form.Input
          className="mt-4"
          size="medium"
          type="password"
          name="password"
          placeholder="Password"
        />
      </FormGroup>
      {error && (
        <FormGroup>
          <Label>{error}</Label>
        </FormGroup>
      )}
      <FormGroup className="mt-4 ">
        <Button stretch type="submit" disabled={loading}>
          Recover password
        </Button>
      </FormGroup>
    </>
  );

  if (response && !error) {
    content = (
      <Text>
        The password has been successfully changed. Please go to{' '}
        <Link to="/login">Sign in</Link> page to sign in.
      </Text>
    );
  }

  return (
    <Form
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={ResetPasswordSchema}
      onSubmit={handleSubmit}
    >
      <AuthPage tips={<RegistrationHero />}>
        <RegistrationHeader
          title="Forgot password"
          subtitle={'Please fill in required data and request password reset'}
        />
        <Row>
          <Col>{content}</Col>
        </Row>
        <RegistrationFooter />
      </AuthPage>
    </Form>
  );
};

export default PageResetPassword;
