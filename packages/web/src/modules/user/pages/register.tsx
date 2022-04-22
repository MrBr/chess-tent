import React, { useEffect } from 'react';
import { RegisterOptions } from '@chess-tent/types';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

import AuthPage from '../components/auth-page';

const { useApi, useHistory, useQuery, useActiveUserRecord } = hooks;
const { Link } = components;
const {
  Icon,
  Form,
  Button,
  FormGroup,
  Label,
  Headline4,
  Text,
  Col,
  Row,
  ToggleButton,
} = ui;

const SignupSchema = yup.object().shape({
  name: yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required(),
  password: yup.string().min(8, 'Too Short!').max(24, 'Too Long!').required(),
  passwordConfirmation: yup.string().when('password', {
    is: val => val && val.length > 0,
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'Both passwords need to be the same')
      .required(),
  }),
  nickname: yup.string().min(4, 'Too Short!').max(16, 'Too Long!').required(),
  email: yup.string().email('Invalid email').required(),
  coach: yup.boolean(),
});

const PageRegister = () => {
  const { fetch, loading, response, error } = useApi(requests.register);
  const { update } = useActiveUserRecord(null);
  const history = useHistory();
  const query = useQuery<RegisterOptions>();

  useEffect(() => {
    if (response && !error) {
      update(response.data);
      history.replace('/');
    }
  }, [response, error, history, update]);

  // Omitting passwordConfirmation field
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = ({ passwordConfirmation, ...user }) => {
    fetch({
      user,
      options: query,
    });
  };

  return (
    <AuthPage>
      <Row>
        <Col>
          <Headline4 className="">Create an account</Headline4>
          <Text fontSize="extra-small">
            Already a member? <Link to="/login">Sign in</Link>
          </Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form
            initialValues={{
              email: '',
              password: '',
              nickname: '',
              name: '',
              passwordConfirmation: '',
              coach: false,
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <>
                <FormGroup>
                  <Form.Input
                    className="mt-4"
                    size="medium"
                    type="text"
                    name="name"
                    placeholder="Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Input
                    className="mt-4"
                    size="medium"
                    type="text"
                    name="nickname"
                    placeholder="Nickname"
                  />
                </FormGroup>
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
                <FormGroup>
                  <Form.Input
                    className="mt-4"
                    size="medium"
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Repeat password"
                  />
                </FormGroup>
                <FormGroup className="mt-4 d-flex">
                  <Row className="w-100 g-0">
                    <Col className="me-3">
                      <ToggleButton
                        type="radio"
                        name="coach"
                        variant="dark"
                        checked={!values['coach']}
                        onClick={() => setFieldValue('coach', false)}
                        stretch
                      >
                        <Icon textual type="pawn" className="me-1" /> I'm
                        student
                      </ToggleButton>
                    </Col>
                    <Col>
                      <ToggleButton
                        type="radio"
                        name="coach"
                        variant="dark"
                        checked={values['coach']}
                        onClick={() => setFieldValue('coach', true)}
                        stretch
                        size="regular"
                      >
                        <Icon textual type="king" className="me-1" />
                        I'm coach
                      </ToggleButton>
                    </Col>
                  </Row>
                </FormGroup>
                {error && (
                  <FormGroup>
                    <Label>{error}</Label>
                  </FormGroup>
                )}
                <FormGroup className="mt-4 ">
                  <Button stretch type="submit" disabled={loading}>
                    Register
                  </Button>
                </FormGroup>
                <Text className="mt-5" fontSize="extra-small">
                  By signing up you agree to our Terms of Services and Privacy
                  Policy
                </Text>
              </>
            )}
          </Form>
        </Col>
      </Row>
    </AuthPage>
  );
};

export default PageRegister;
