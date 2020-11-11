import React, { useEffect } from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

const { useApi } = hooks;
const { Redirect } = components;
const {
  Form,
  Button,
  FormGroup,
  Label,
  Container,
  Headline1,
  Card,
  Text,
  Col,
  Row,
} = ui;

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
    <Container className="h-100 d-flex justify-content-center align-items-center no-gutters mx-auto">
      <Col className="col-lg-6 col-md-8 col-sm-10 col-12">
        <Card className="px-5 py-5 border rounded-lg">
          <Row className="d-flex justify-content-between align-items-center">
            <Col className="col-12 col-sm-6 text-center">
              <Headline1>Sign In</Headline1>
            </Col>
            <Col className="col-12 col-sm-6 text-center">
              <Text fontSize="small" className="d-inline">
                Don’t have an account?
              </Text>
              <Text fontSize="small" className="font-weight-bold d-inline ml-1">
                <u>Sign Up</u>
              </Text>
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
            <FormGroup>
              <Label>Email</Label>
              <Form.Input size="lg" type="email" name="email" />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Form.Input size="lg" type="password" name="password" />
            </FormGroup>
            <FormGroup className="w-100 d-flex justify-content-between align-items-center mt-4">
              <Row className="w-100" noGutters>
                <Col className="col-12 col-sm-6 order-2 order-sm-1">
                  <Text fontSize="small" className="text-center">
                    <u>Forgot password?</u>
                  </Text>
                </Col>
                <Col className="col-12 col-sm-6 text-center order-1 order-sm-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-block mb-3"
                  >
                    Login
                  </Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </Card>
      </Col>
    </Container>
  );
};
