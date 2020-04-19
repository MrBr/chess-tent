import React, { FunctionComponent, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';

import { StepComponent } from '../app/types';
import Chessboard, { State } from '../chessboard';

interface DescriptionStepState {
  position: string;
  description: string;
  title: string;
  shapes: State['drawable']['shapes'];
}

const Editor: StepComponent<DescriptionStepState> = ({ setState, state }) => {
  const updatePosition = useCallback(
    position => {
      setState({
        position,
      });
    },
    [setState],
  );

  const updateShapes = useCallback(
    shapes => {
      setState({
        shapes,
      });
    },
    [setState],
  );

  const updateDescriptionDebounced = useCallback(
    _.debounce((description: string) => {
      setState({ description });
    }, 500),
    [],
  );

  const updateDescription = useCallback(e => {
    updateDescriptionDebounced(e.target.value);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Describe next few steps"
              onChange={updateDescription}
              defaultValue={state.description}
            />
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            tip="Setup position for the description"
            onChange={updatePosition}
            onShapesChange={updateShapes}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Description</>;
};

const Playground: StepComponent<DescriptionStepState> = ({ state }) => {
  return <>{state.title}</>;
};

const Exercise: StepComponent<DescriptionStepState> = ({ state }) => {
  return <>{state.title || 'Description'}</>;
};

const type = 'description';

export { Editor, Picker, Playground, Exercise, type };
