import React from 'react';
import { components, ui } from '@application';

import { RegistrationWizardStep } from '../../types';

const { Button, FormGroup, Col, Row, Modal, Label } = ui;
const { DifficultyDropdown, TagsSelect } = components;

const LessonStep: RegistrationWizardStep = {
  label: 'Lesson',
  Component: props => {
    const { state, mergeUpdateState, nextStep } = props;
    return (
      <>
        <Modal.Body className="px-4 pt-0 pb-5">
          <Row>
            <Col>
              <FormGroup className="mt-3">
                <Label>Difficulty</Label>
                <DifficultyDropdown
                  id="difficulty"
                  size="small"
                  includeNullOption={false}
                  initial={state.state?.role?.level}
                  onChange={level => {
                    mergeUpdateState({ state: { role: { level } } });
                  }}
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

export default LessonStep;
