import React from 'react';
import { hooks, ui } from '@application';
import { updateSubject } from '@chess-tent/models';

import { RegistrationWizardStep } from '../../types';
import EditableUserAvatar from '../editable-user-avatar';

const { Button, FormGroup, Col, Row, Input, Modal, Label } = ui;
const { useInputStateUpdate, useActiveUserRecord } = hooks;

const FinalizeStep: RegistrationWizardStep = {
  label: 'Finalize',
  Component: props => {
    const { state, mergeUpdateState, close } = props;
    const updateInput = useInputStateUpdate(300, mergeUpdateState);
    const { update, save, value: user } = useActiveUserRecord();
    return (
      <>
        <Modal.Body className="px-4 pt-0 pb-5">
          <Row>
            <Col>
              <FormGroup className="mt-3">
                <Label>Set a profile picture</Label>
                <div>
                  <EditableUserAvatar />
                </div>
              </FormGroup>
              <FormGroup className="mt-3">
                <Label>About</Label>
                <Input
                  size="small"
                  placeholder="Few words about yourself"
                  name="state.about"
                  value={state.state?.about}
                  onChange={updateInput}
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
              update(updateSubject(user, state));
              save().then(close);
            }}
          >
            Complete
          </Button>
        </Modal.Footer>
      </>
    );
  },
};

export default FinalizeStep;
