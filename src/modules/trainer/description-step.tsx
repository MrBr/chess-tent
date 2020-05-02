import React, { FunctionComponent, useCallback } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';
import { DrawShape } from 'chessground/draw';
import { FEN } from 'chessground/types';

import { Move, StepComponent, StepInstance } from '../app/types';
import Chessboard from '../chessboard';
import { Action } from './step';
import { updateStepStateAction } from './redux';
import { Button } from '../ui/Button';
import { useDispatchBatched } from '../app/hooks';

type DescriptionStep = StepInstance<{
  moves: Move[];
  shapes: DrawShape[];
  position: FEN;
  description: string;
}>;

const Editor: StepComponent<DescriptionStep> = ({
  step,
  addSection,
  addStep,
}) => {
  const dispatch = useDispatchBatched();
  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(updateStepStateAction(step, { shapes })),
    [dispatch, step],
  );
  const updateMoves = useCallback(
    (position: FEN, move: Move | undefined) =>
      move &&
      dispatch(
        updateStepStateAction(step, {
          moves: [...step.state.moves, move],
        }),
      ),
    [dispatch, step],
  );

  const updateDescriptionDebounced = useCallback(
    _.debounce((description: string) => {
      dispatch(updateStepStateAction(step, { description }));
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
              defaultValue={step.state.description}
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

const Playground: StepComponent<DescriptionStep> = ({ step }) => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<DescriptionStep> = ({ step }) => {
  return <>{'Description'}</>;
};

const ActionsComponent: StepComponent<DescriptionStep> = ({ step }) => {
  return (
    <>
      Actions
      <div>
        {step.state.moves.map(move => (
          <Action>{move}</Action>
        ))}
        {step.state.shapes.map(shape => (
          <Action>{shape.brush}</Action>
        ))}
      </div>
    </>
  );
};

const type = 'description';

const getInitialState = () => {
  return {
    moves: [],
    shapes: [],
    position: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR',
  };
};

export {
  Editor,
  Picker,
  Playground,
  Exercise,
  ActionsComponent as Actions,
  getInitialState,
  type,
};
