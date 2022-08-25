import React, { useEffect } from 'react';
import { hooks, requests, ui } from '@application';
import * as yup from 'yup';
import { RegisterRequestParams } from '@chess-tent/types';

import { RegistrationWizardStep } from '../../types';

const { Button, FormGroup, Label, Col, Row, Input, Spinner } = ui;
const {
  useInputStateUpdate,
  useValidation,
  useApi,
  useComponentStateSilent,
  useActiveUserRecord,
} = hooks;

const AccountSchema = yup.object().shape({
  name: yup
    .string()
    .label('Name')
    .min(2, 'Name too Short!')
    .max(70, 'Name too Long!')
    .required(),
  password: yup
    .string()
    .label('Password')
    .min(8, 'Password too Short!')
    .max(24, 'Password too Long!')
    .required(),
  nickname: yup
    .string()
    .label('Nickname')
    .min(4, 'Nickname too Short!')
    .max(16, 'Nickname too Long!')
    .required(),
  email: yup.string().label('Email').email('Invalid email format').required(),
  coach: yup.boolean(),
});

const AccountStep: RegistrationWizardStep = {
  required: false,
  label: 'Account',
  Component: ({
    mergeUpdateState,
    state,
    nextStep,
    completeStep,
    completed,
  }) => {
    const userValidate = useApi(requests.register);
    const [validationError, validate] = useValidation(AccountSchema);
    const { update, value: user } = useActiveUserRecord(null);
    const updateInput = useInputStateUpdate(300, mergeUpdateState);
    const { mounted } = useComponentStateSilent();

    useEffect(() => {
      // User just validated "on request" - move on
      if (userValidate.response && mounted && completed) {
        nextStep();
        return;
      }

      if (userValidate.response && !userValidate.error && !validationError) {
        completeStep();
      }
    }, [
      mounted,
      nextStep,
      completed,
      mergeUpdateState,
      userValidate,
      validationError,
      completeStep,
    ]);

    useEffect(() => {
      // User changed - invalidate
      if (mounted && completed) {
        console.log('TEST');
        completeStep(false);
      }
    }, [nextStep, mergeUpdateState, completed, mounted, completeStep]);

    const onNext = () => {
      if (completed) {
        nextStep();
        return;
      }
      if (user) {
        update({ ...user, ...state });
        return;
      }
      !userValidate.loading &&
        validate(state) &&
        userValidate.fetch(state as RegisterRequestParams);
    };

    return (
      <>
        <Row>
          <Col>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="text"
                placeholder="Name"
                name="name"
                defaultValue={state.name}
                onChange={updateInput}
                disabled={userValidate.loading}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="text"
                placeholder="Nickname"
                name="nickname"
                defaultValue={state.nickname}
                onChange={updateInput}
                disabled={userValidate.loading}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="email"
                placeholder="Email"
                name="email"
                defaultValue={state.email}
                onChange={updateInput}
                disabled={userValidate.loading}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="password"
                placeholder="Password"
                name="password"
                defaultValue={state.password}
                onChange={updateInput}
                disabled={userValidate.loading}
              />
            </FormGroup>
            {validationError && (
              <FormGroup className="mt-3">
                <Label>{validationError.message}</Label>
              </FormGroup>
            )}
            <FormGroup className="mt-4 ">
              <Button
                stretch
                type="submit"
                onClick={onNext}
                disabled={userValidate.loading}
              >
                Next
                {userValidate.loading && <Spinner animation="border" />}
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </>
    );
  },
};

export default AccountStep;
