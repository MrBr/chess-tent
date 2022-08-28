import React from 'react';
import { components, hooks, ui } from '@application';

import { RegistrationWizardStep } from '../../types';
import SelectLanguages from '../select-languages';

const { Button, FormGroup, Col, Row, Modal, Label, Input } = ui;
const { useInputStateUpdate } = hooks;
const { TagsSelect } = components;

const StudentStep: RegistrationWizardStep = {
  label: 'Learning',
  Component: props => {
    const { state, mergeUpdateState, nextStep } = props;
    const updateInput = useInputStateUpdate(200, mergeUpdateState);
    return (
      <>
        <Modal.Body className="px-4 pt-0 pb-5">
          <Row>
            <Col>
              <FormGroup className="mt-3">
                <Label>What you'd like to improve</Label>
                <Input
                  size="small"
                  type="text"
                  rows={2}
                  placeholder="Current problems"
                  name="state.role.note"
                  defaultValue={state.state?.role?.note}
                  onChange={updateInput}
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>Topics</Label>
                <TagsSelect
                  selected={state.state?.role?.tags}
                  onChange={tags => {
                    mergeUpdateState({ state: { role: { tags } } });
                  }}
                />
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>Acceptable languages</Label>
                <SelectLanguages
                  languages={state?.state?.languages}
                  onChange={languages => {
                    mergeUpdateState({
                      state: { languages },
                    });
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              nextStep();
            }}
          >
            Next
          </Button>
        </Modal.Footer>
      </>
    );
  },
};

export default StudentStep;
