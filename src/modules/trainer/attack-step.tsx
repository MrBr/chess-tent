import React, {FunctionComponent, useCallback, useRef} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import _ from 'lodash';

import { FormGroup, Form } from '../ui/Form';
import AdvancedChessboard, {AdvancedChessboardState} from './advanced-chessboard';
import {SquareKey} from "../chessboardjs";
import { StepComponent } from "../app/types";

interface AttackStepState {
  question: string;
  square: SquareKey;
  position: string;
  squareState: AdvancedChessboardState['squares'];
  title: string;
}

const Editor: StepComponent<AttackStepState> = ({ setState, state: { question, square } }) => {
  const advancedBoard = useRef<AdvancedChessboard>(null);

  const updatePosition = useCallback((position: string) => {
    setState({ position });
  }, [setState]);

  const updateSquare = useCallback((newSquare: SquareKey, state: AdvancedChessboardState['squares']) => {
    setState({
      square: newSquare,
      squareState: state,
    });
    square && advancedBoard.current && advancedBoard.current.deselectSquare(square);
  }, [setState]);

  const updateQuestionDebounced = useCallback(_.debounce((question: string) => {
    setState({ question });
  }, 500), []);

  const updateQuestion = useCallback((e) => {
    updateQuestionDebounced(e.target.value)
  }, []);

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
            <div>
            </div>
          </FormGroup>
        </Col>
        <Col>
          <AdvancedChessboard
            ref={advancedBoard}
            tip="Setup position and select square for the attack"
            onChange={updatePosition}
            onSquareSelected={updateSquare}
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

export {
  Editor,
  Picker,
  Playground,
  Exercise,
  type,
}
