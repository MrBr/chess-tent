import React, { FunctionComponent, useCallback, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import _ from 'lodash';

import { FormGroup, Form } from '../ui/Form';
import Chessboard, { SquareKey, State } from '../chessboard';
import { StepComponent } from '../app/types';

interface AttackStepState {
  question: string;
  square: SquareKey;
  position: string;
  shapes: State['drawable']['shapes'];
  title: string;
}

const Editor: StepComponent<AttackStepState> = ({
  setState,
  state: { question, square },
}) => {
  const advancedBoard = useRef<Chessboard>(null);

  const updatePosition = useCallback(
    (position: string) => {
      setState({ position });
    },
    [setState],
  );

  const updateAttackSquare = useCallback(
    (newSquare: SquareKey, state: State['drawable']['shapes']) => {
      setState({
        square: newSquare,
        shapes: state,
      });
    },
    [setState],
  );
  const onSquareSelected = useCallback(
    (newSquare: SquareKey, state: State['drawable']['shapes']) => {
      updateAttackSquare(newSquare, state);
    },
    [updateAttackSquare, square],
  );

  const updateQuestionDebounced = useCallback(
    _.debounce((question: string) => {
      setState({ question });
    }, 500),
    [],
  );

  const updateQuestion = useCallback(
    e => {
      updateQuestionDebounced(e.target.value);
    },
    [updateQuestionDebounced],
  );

  return (
    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Form.Label>Explanation:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Why selected square is attacked, why is it important or simply describe position."
              onChange={updateQuestion}
              defaultValue={question}
            />
            <Form.Label>Square to attack: {square}</Form.Label>
          </FormGroup>
          <FormGroup>
            <Form.Label>How to attack:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Shortly describe the idea behind the attack."
              onChange={updateQuestion}
              defaultValue={question}
            />
            <Form.Label>Attack sequence:</Form.Label>
            <div></div>
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            ref={advancedBoard}
            tip="Setup position and select square for the attack"
            onChange={updatePosition}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Attack square or piece</>;
};

const Playground: StepComponent<AttackStepState> = () => {
  return <>Attack square or piece</>;
};

const Exercise: StepComponent<AttackStepState> = ({ state }) => {
  return <>{state.title || 'Attack square or piece'}</>;
};

const type = 'attack';

export { Editor, Picker, Playground, Exercise, type };
