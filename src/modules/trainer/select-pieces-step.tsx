import React, { FunctionComponent, useCallback, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';

import Chessboard, { State } from '../chessboard';
import Chess from '../chess';
import { StepComponent } from '../app/types';
import { SquareKey } from '../chessboard';

interface SelectPiecesStepState {
  question: string;
  title: string;
  position: string;
  shapes: State['drawable']['shapes'];
}

const Editor: StepComponent<SelectPiecesStepState> = ({
  setState,
  state: { question, shapes },
}) => {
  const chessboard = useRef<Chessboard>(null);
  const updatePosition = useCallback(
    (position, lastMove) => {
      setState({
        position,
      });
      if (!chessboard.current) {
        return;
      }
      const state = chessboard.current.getState();
      const shape = state.drawable.shapes.find(
        shape => shape.orig === lastMove[0],
      );
      shape && chessboard.current.removeShape(shape);
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

  const updateQuestionDebounced = useCallback(
    _.debounce((question: string) => {
      setState({ question });
    }, 500),
    [],
  );

  const updateQuestion = useCallback(e => {
    updateQuestionDebounced(e.target.value);
  }, []);

  const validateSelect = useCallback(shapes => {
    if (!chessboard.current || shapes.dest) {
      return false;
    }
    const square = shapes.orig;
    const fen = `${chessboard.current.fen()} w KQkq - 0 1`;
    const chess = new Chess(fen);
    return !!chess.get(square);
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Form.Label>Question:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Describe what pieces needs to be selected"
              onChange={updateQuestion}
              defaultValue={question}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Selected pieces:</Form.Label>
            {!_.isEmpty(shapes) ? (
              shapes.map(shape => <h6>{shape.orig}</h6>)
            ) : (
              <p className="text-muted">
                No pieces selected, use right click on the board.
              </p>
            )}
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            validateDrawable={validateSelect}
            ref={chessboard}
            tip="Setup position and select pieces for the task"
            onChange={updatePosition}
            onShapesChange={updateShapes}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Select pieces</>;
};

const Playground: StepComponent<SelectPiecesStepState> = () => {
  return <>Select pieces</>;
};

const Exercise: StepComponent<SelectPiecesStepState> = ({ state }) => {
  return <>{state.title || 'Select pieces'}</>;
};

const type = 'select-pieces';

export { Editor, Picker, Playground, Exercise, type };
