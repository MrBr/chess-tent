import React, { useCallback, useState } from 'react';
import { hooks, ui } from '@application';
import { WizardStep } from '@types';
import * as yup from 'yup';

import { RegistrationWizardStep } from '../../types';

const { Button, FormGroup, Label, Col, Row, Input, Text, Line } = ui;
const { useInputStateUpdate, useValidation } = hooks;

const ChessDetailsSchema = yup.object().shape({
  state: yup.object().shape({
    elo: yup
      .number()
      .label('ELO rating')
      .min(0, 'Minimum ELO at least 0')
      .max(3500, 'Maximum ELO is 3500')
      .required(),
  }),
});

const ChessDetailsStep: RegistrationWizardStep = {
  required: true,
  label: 'Chess details',
  Component: ({ updateState, state, nextStep }) => {
    const [error, validate] = useValidation(ChessDetailsSchema);
    const updateInput = useInputStateUpdate(300, updateState);
    return (
      <>
        <Row>
          <Col>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="number"
                placeholder="ELO rating"
                name="state.elo"
                value={state.state?.elo}
                onChange={updateInput}
              />
            </FormGroup>
            <Text fontSize="small" className="mt-3 mb-2">
              Optional
            </Text>
            <Line />
            <FormGroup>
              <Input
                className="mt-3"
                size="medium"
                type="text"
                placeholder="FIDE title"
                name="state.fideTitle"
                value={state.state?.fideTitle}
                onChange={updateInput}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="email"
                placeholder="Playing experience"
                name="state.playingExperience"
                value={state.state?.playingExperience}
                onChange={updateInput}
              />
            </FormGroup>
            <FormGroup>
              <Input
                className="mt-4"
                size="medium"
                type="email"
                placeholder="Speciality"
                name="state.speciality"
                value={state.state?.speciality}
                onChange={updateInput}
              />
            </FormGroup>
            {error && (
              <FormGroup>
                <Label>{error.message}</Label>
              </FormGroup>
            )}
            <FormGroup className="mt-4 ">
              <Button
                stretch
                type="submit"
                onClick={() => {
                  console.log(validate(state), state);
                  validate(state) && nextStep();
                }}
              >
                Next
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </>
    );
  },
};

export default ChessDetailsStep;
