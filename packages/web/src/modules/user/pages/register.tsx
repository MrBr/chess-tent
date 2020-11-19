import React from 'react';
import { ui, hooks, requests, components } from '@application';
import * as yup from 'yup';

const { useApi, useHistory } = hooks;
const { Redirect } = components;
const {
  Form,
  Button,
  FormGroup,
  Label,
  Container,
  Absolute,
  Icon,
  Card,
  Headline1,
} = ui;

const SignupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Too Short!')
    .max(70, 'Too Long!')
    .required(),
  password: yup
    .string()
    .min(8, 'Too Short!')
    .max(24, 'Too Long!')
    .required(),
  passwordConfirmation: yup.string().when('password', {
    is: val => val && val.length > 0,
    then: yup
      .string()
      .oneOf([yup.ref('password')], 'Both passwords need to be the same')
      .required(),
  }),
  nickname: yup
    .string()
    .min(4, 'Too Short!')
    .max(16, 'Too Long!')
    .required(),
  email: yup
    .string()
    .email('Invalid email')
    .required(),
  coach: yup.boolean(),
});

export default () => {
  const { fetch, loading, response } = useApi(requests.register);
  const history = useHistory();
  if (response && !response.error) {
    return <Redirect to="/" />;
  }
  return (
    <Container className="h-100 d-flex justify-content-center align-items-center no-gutters mx-auto">
      <Card className="px-5 py-4 border rounded-lg">
        <Headline1 className="mb-4">Create your account</Headline1>
        <Form
          initialValues={{
            email: '',
            password: '',
            nickname: '',
            name: '',
            passwordConfirmation: '',
          }}
          validationSchema={SignupSchema}
          // Omitting passwordConfirmation
          onSubmit={({ passwordConfirmation, ...user }) => fetch(user)}
        >
          <FormGroup>
            <Form.Input
              className="mt-4"
              size="lg"
              type="text"
              name="name"
              placeholder="Name"
            />
          </FormGroup>
          <FormGroup>
            <Form.Input
              className="mt-4"
              size="lg"
              type="text"
              name="nickname"
              placeholder="Nickname"
            />
          </FormGroup>
          <FormGroup>
            <Form.Input
              className="mt-4"
              size="lg"
              type="email"
              name="email"
              placeholder="Email"
            />
          </FormGroup>
          <FormGroup>
            <Form.Input
              className="mt-4"
              size="lg"
              type="password"
              name="password"
              placeholder="Password"
            />
          </FormGroup>
          <FormGroup>
            <Form.Input
              className="mt-4"
              size="lg"
              type="password"
              name="passwordConfirmation"
              placeholder="Repeat password"
            />
          </FormGroup>
          <FormGroup className="mt-4 d-flex">
            <Label htmlFor="pick-coach">Are you coach?</Label>
            <Form.Check
              size="sm"
              className="w-25 shadow-none"
              name="coach"
              id="pick-coach"
            />
          </FormGroup>
          <FormGroup className="mt-4 d-flex justify-content-end">
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </FormGroup>
        </Form>
      </Card>
      <Absolute left={25} top={15} onClick={() => history.goBack()}>
        <Icon type="close" size="large" />
      </Absolute>
    </Container>
  );
};
