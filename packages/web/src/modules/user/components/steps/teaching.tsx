import React from 'react';
import { hooks, ui } from '@application';
import * as yup from 'yup';

import { RegistrationWizardStep } from '../../types';
import SelectLanguages from '../select-languages';
import SelectStudentElo from '../select-student-elo';

const { Button, FormGroup, Col, Row, Input, Modal, Label, InputGroup } = ui;
const { useInputStateUpdate, useValidation } = hooks;

const TeachingSchema = yup.object().shape({
  state: yup.object().shape({
    punchline: yup
      .string()
      .label('Punchline')
      .max(100, 'Max 100 chars')
      .required(),
    pricing: yup.number().label('Pricing').required(),
    studentEloMin: yup.number().required(),
    studentEloMax: yup.number().required(),
  }),
});

const TeachingStep: RegistrationWizardStep = {
  required: true,
  label: 'Teaching',
  Component: props => {
    const { state, mergeUpdateState, nextStep, completeStep } = props;
    const [error, validate] = useValidation(TeachingSchema);
    const updateInput = useInputStateUpdate(200, mergeUpdateState);
    return (
      <>
        <Modal.Body className="px-4 pt-0 pb-5">
          <Row>
            <Col>
              <FormGroup className="mt-3">
                <Label>Punchline*</Label>
                <Input
                  size="small"
                  placeholder="Be creative"
                  name="state.punchline"
                  defaultValue={state.state?.punchline}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>Pricing*</Label>
                <InputGroup>
                  <Input
                    size="small"
                    type="number"
                    placeholder="Be fair"
                    name="state.pricing"
                    defaultValue={state.state?.pricing}
                    onChange={updateInput}
                  />
                  <InputGroup.Text>$/hr</InputGroup.Text>
                </InputGroup>
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>Languages*</Label>
                <SelectLanguages
                  languages={state?.state?.languages}
                  onChange={languages => {
                    mergeUpdateState({
                      state: { languages },
                    });
                  }}
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>Student elo*</Label>
                <SelectStudentElo
                  range={[
                    state?.state?.studentEloMin as number,
                    state?.state?.studentEloMax as number,
                  ]}
                  onChange={([studentEloMin, studentEloMax]) => {
                    mergeUpdateState({
                      state: { studentEloMax, studentEloMin },
                    });
                  }}
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

export default TeachingStep;
