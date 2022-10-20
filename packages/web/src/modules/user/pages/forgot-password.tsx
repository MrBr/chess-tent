import React from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

import AuthPage from '../components/auth-page';
import RegistrationFooter from '../components/registration-footer';
import RegistrationHeader from '../components/registration-header';
import RegistrationHero from '../components/registration-hero';

const { useApi, useActiveUserRecord } = hooks;
const { Text, Form, Button, FormGroup, Label, Col, Row } = ui;
const { Redirect } = components;

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required(),
});

const PageForgotPassword = () => {
  const { fetch, loading, response, error } = useApi(requests.forgotPassword);
  const { value: activeUser } = useActiveUserRecord<null>();

  if (activeUser) {
    return <Redirect to="/" />;
  }

  const handleSubmit = ({ email }: { email: string }) => {
    fetch({
      email,
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
      <Text className="mt-4" weight={400}>
        The link to reset password has been sent to your email.
      </Text>
    );
  }

  return (
    <Form
      initialValues={{
        email: '',
      }}
      validationSchema={ForgotPasswordSchema}
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

export default PageForgotPassword;
