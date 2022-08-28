import React from 'react';
import { hooks, ui } from '@application';
import * as yup from 'yup';

import { RegistrationWizardStep } from '../../types';
import SelectFideTitle from '../select-fide-title';

const { Button, FormGroup, Col, Row, Input, Modal, Label } = ui;
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
  Component: props => {
    const { state, nextStep, mergeUpdateState, close, completeStep } = props;
    const [error, validate] = useValidation(ChessDetailsSchema);
    const updateInput = useInputStateUpdate(200, mergeUpdateState);
    return (
      <>
        <Modal.Body className="px-4 pt-0 pb-5">
          <Row>
            <Col>
              <FormGroup className="mt-3">
                <Label>Rating*</Label>
                <Input
                  size="small"
                  type="number"
                  placeholder="Elo"
                  name="state.elo"
                  defaultValue={state.state?.elo}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>FIDE title</Label>
                <SelectFideTitle
                  fideTitle={state.state?.fideTitle}
                  onChange={fideTitle =>
                    mergeUpdateState({
                      state: { fideTitle },
                    })
                  }
                />
              </FormGroup>
              {error && (
                <FormGroup className="mt-2">
                  <Label>{error.message}</Label>
                </FormGroup>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Maybe later
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              if (validate(state)) {
                completeStep();
                nextStep();
              }
            }}
          >
            Next
          </Button>
        </Modal.Footer>
      </>
    );
  },
};

export default ChessDetailsStep;
