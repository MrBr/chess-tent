import React, { FunctionComponent } from 'react';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import _ from 'lodash';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { StepModuleType } from '../app';

interface StepPickerProps {
  steps: StepModuleType[];
  show: boolean;
  close: () => void;
  onSelect: (Step: StepModuleType) => void;
}

export const StepPicker: FunctionComponent<StepPickerProps> = ({
  show,
  close,
  steps,
  onSelect,
}) => (
  <Modal size="lg" show={show} onHide={close}>
    <Modal.Header closeButton>
      <Modal.Title>Select a step</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Container>
        {_.chunk(steps, 3).map((rowItems, index) => (
          <Row key={`step-row-${index}`}>
            {rowItems.map((Step, stepIndex) => (
              <Col
                sm={4}
                key={`step-${stepIndex}-${Step.type}`}
                onClick={() => onSelect(Step)}
              >
                <Step.Picker />
              </Col>
            ))}
          </Row>
        ))}
      </Container>
    </Modal.Body>
  </Modal>
);
