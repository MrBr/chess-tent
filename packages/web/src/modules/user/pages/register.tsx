import React, { useEffect } from 'react';
import { RegisterOptions } from '@chess-tent/types';
import { ui, hooks, requests, components, constants } from '@application';
import * as yup from 'yup';
import { User } from '@chess-tent/models';

import AuthPage from '../components/auth-page';
import RegistrationFooter from '../components/registration-footer';
import RegistrationHeader from '../components/registration-header';
import RegistrationTips from '../components/registration-tips';
import { registrationFlows } from '../constants';

const { useApi, useHistory, useQuery, useActiveUserRecord } = hooks;
const { Icon, Form, Button, FormGroup, Label, Col, Row, ToggleButton } = ui;
const { Link } = components;

const SignupSchema = yup.object().shape({
  name: yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required(),
  password: yup.string().min(8, 'Too Short!').max(24, 'Too Long!').required(),
  nickname: yup.string().min(4, 'Too Short!').max(16, 'Too Long!').required(),
  email: yup.string().email('Invalid email').required(),
  coach: yup.boolean(),
  docsAccepted: yup.boolean().oneOf([true]).required(),
});

interface SignupData {
  name: string;
  password: string;
  nickname: string;
  email: string;
  coach: boolean;
  docsAccepted: boolean;
}

const resolveFlow = (flow: RegisterOptions['flow'], coach?: boolean) => {
  return flow || (coach ? 'teach' : 'student');
};
const PageRegister = () => {
  const { fetch, loading, response, error } = useApi(requests.register);

  const { update } = useActiveUserRecord<null>();
  const history = useHistory();
  const query = useQuery<RegisterOptions>();
  const { flow, redirect } = query;
  const loggedInPath = redirect ? decodeURI(redirect) : '/';

  useEffect(() => {
    if (response && !error) {
      update(response.data);
      history.replace(loggedInPath, {
        from: `/${history.location.pathname}?flow=${resolveFlow(
          flow,
          response.data.coach,
        )}`,
      });
    }
  }, [response, error, history, update, flow, loggedInPath]);

  const handleSubmit = ({ docsAccepted, ...basicUserData }: SignupData) => {
    const user: Partial<User> = {
      ...basicUserData,
      state: {
        acceptedDocsDate: new Date(),
      },
    };
    fetch({
      user,
      options: query,
    });
  };

  return (
    <Form
      initialValues={{
        email: '',
        password: '',
        nickname: '',
        name: '',
        coach: flow === 'teach',
        docsAccepted: false,
      }}
      validationSchema={SignupSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => {
        const content = registrationFlows[resolveFlow(flow, values['coach'])];
        return (
          <AuthPage tips={<RegistrationTips {...content.tips} />}>
            <RegistrationHeader
              title={content.title}
              subtitle={content.subtitle}
            />
            <Row>
              <Col>
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
                  {!flow && (
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
                  )}
                  <FormGroup className="mt-4">
                    <Row>
                      <Col className="col-auto">
                        <Form.Check name="docsAccepted" required />
                      </Col>
                      <Col>
                        <Label>
                          By clicking on checkbox, you agree with Chess Tent{' '}
                          <Link to={constants.ToS_PATH} target="_blank">
                            Terms of Services
                          </Link>{' '}
                          &{' '}
                          <Link to={constants.PP_PATH} target="_blank">
                            Privacy Policy
                          </Link>
                        </Label>
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
                      Create account
                    </Button>
                  </FormGroup>
                </>
              </Col>
            </Row>
            <RegistrationFooter terms />
          </AuthPage>
        );
      }}
    </Form>
  );
};

export default PageRegister;
