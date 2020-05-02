import React, { FunctionComponent, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';
import { DrawShape } from 'chessground/draw';
import { FEN } from 'chessground/types';

import { BasicStep, Move, StepComponent } from '../app/types';
import Chessboard from '../chessboard';
import { Action } from './step';
import { addStepMoveAction, updateStepAction } from './redux';
import { Button } from '../ui/Button';
import { useDispatchBatched } from '../app/hooks';

const Editor: StepComponent<BasicStep> = ({ step, addSection, addStep }) => {
  const dispatch = useDispatchBatched();
  const updateShapes = useCallback((shapes: DrawShape[]) => {
    // dispatch(addStepShape(step, shapes);
  }, []);
  const updateMoves = useCallback(
    (position: FEN, move: Move | undefined) => {
      move && dispatch(addStepMoveAction(step, move));
    },
    [dispatch, step],
  );

  const updateDescriptionDebounced = useCallback(
    _.debounce((description: string) => {
      dispatch(updateStepAction(step, { description }));
    }, 500),
    [dispatch],
  );

  const updateDescription = useCallback(
    e => {
      updateDescriptionDebounced(e.target.value);
    },
    [updateDescriptionDebounced],
  );

  const BoardHeader = () => (
    <div>
      <Button onClick={addSection}>Add section</Button>
      <Button onClick={addStep}>Add step</Button>
    </div>
  );
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
              defaultValue={step.description}
            />
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            header={<BoardHeader />}
            onChange={updateMoves}
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

const Playground: StepComponent<BasicStep> = ({ step }) => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<BasicStep> = ({ step }) => {
  return <>{'Description'}</>;
};

const ActionsComponent: StepComponent<BasicStep> = ({ step }) => {
  return (
    <>
      Actions
      <div>
        {step.moves.map(move => (
          <Action>{move}</Action>
        ))}
        {step.shapes.map(shape => (
          <Action>{shape.brush}</Action>
        ))}
      </div>
    </>
  );
};

const type = 'description';

export {
  Editor,
  Picker,
  Playground,
  Exercise,
  ActionsComponent as Actions,
  type,
};
