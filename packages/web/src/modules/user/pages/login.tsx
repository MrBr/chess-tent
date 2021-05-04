import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { ui, hooks, requests, components, utils } from '@application';
import * as yup from 'yup';

const { useApi, useHistory } = hooks;
const { Redirect, Link } = components;
const {
  Form,
  Button,
  FormGroup,
  Container,
  Headline1,
  Card,
  Text,
  Col,
  Row,
  Icon,
  Absolute,
  Headline6,
} = ui;

const { mediaQueryEnhancer } = utils;

const LoginSchema = yup.object().shape({
  password: yup.string().required(),
  email: yup.string().email('Invalid email').required(),
});

const NoWrapText = styled(Headline6)({
  whiteSpace: 'nowrap',
});

const LoginButton = styled(Button)(
  mediaQueryEnhancer('xs', {
    width: '100%',
  }),
);

export default () => {
  const { fetch, loading, response } = useApi(requests.login);
  const [user, updateUser] = hooks.useActiveUserRecord();
  const history = useHistory();

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
    <Container className="h-100 d-flex justify-content-center align-items-center no-gutters mx-auto">
      <Absolute
        left={25}
        top={15}
        onClick={() => history.push('/')}
        className="cursor-pointer"
      >
        <Icon type="close" size="large" />
      </Absolute>
      <Col className="col-xl-6 col-lg-8 col-md-10 col-sm-12">
        <Card className="px-5 py-4 border rounded-lg">
          <Row className="d-flex justify-content-between align-items-center">
            <Col className="col-12 col-sm-6 d-flex justify-content-center justify-content-sm-start">
              <Headline1>Sign In</Headline1>
            </Col>
            <Col className="col-12 col-sm-6 d-flex flex-nowrap justify-content-center justify-content-sm-end">
              <NoWrapText>Don’t have an account?</NoWrapText>
              <NoWrapText className="font-weight-bold ml-1">
                <Link to="/register">
                  <u>Sign Up</u>
                </Link>
              </NoWrapText>
            </Col>
          </Row>
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
                size="large"
                type="email"
                name="email"
                placeholder="Email address"
              />
            </FormGroup>
            <FormGroup className="pt-3">
              <Form.Input
                size="large"
                type="password"
                name="password"
                placeholder="Password"
              />
            </FormGroup>
            <FormGroup className="w-100 d-flex justify-content-between align-items-center mt-4">
              <Row className="w-100" noGutters>
                <Col className="col-12 col-sm-6 order-2 order-sm-1 d-flex align-items-center justify-content-center justify-content-sm-start">
                  <Text fontSize="small" className="text-center text-sm-left">
                    <u>Forgot password?</u>
                  </Text>
                </Col>
                <Col className="col-12 col-sm-6 order-1 order-sm-2 d-flex justify-content-center justify-content-sm-end">
                  <LoginButton
                    type="submit"
                    disabled={loading}
                    className="mb-3"
                  >
                    Login
                  </LoginButton>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </Card>
      </Col>
    </Container>
  );
};
