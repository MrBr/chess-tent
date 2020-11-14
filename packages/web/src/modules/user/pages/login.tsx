import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';
import { Link } from 'react-router-dom';

const { useApi, useHistory } = hooks;
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
  Icon,
  Absolute,
  Modal,
  Headline6,
} = ui;

console.log({ Modal });

const LoginSchema = yup.object().shape({
  password: yup.string().required(),
  email: yup
    .string()
    .email('Invalid email')
    .required(),
});

const NoWrapText = styled(Headline6)({
  whiteSpace: 'nowrap',
});

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
    // <Modal
    //   show
    //   dialogClassName="full-screen-dialog"
    //   onEscapeKeyDown={() => history.goBack()}
    // >
    <>
      <Container className="h-100 d-flex justify-content-center align-items-center no-gutters mx-auto">
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
      <Absolute left={25} top={15} onClick={() => history.goBack()}>
        <Icon type="close" size="large" />
      </Absolute>
    </>
    //  </Modal>
  );
};
