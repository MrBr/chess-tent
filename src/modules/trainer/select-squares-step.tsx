import React, {FunctionComponent, useCallback} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormGroup from "react-bootstrap/FormGroup";
import _ from 'lodash';

import AdvancedChessboard, {AdvancedChessboardState} from './advanced-chessboard';
import {StepComponent} from "../app/types";

interface SelectSquaresStepState {
  question: string;
  title: string;
  position: string;
  squares: AdvancedChessboardState['squares'];
}

const Editor: StepComponent<SelectSquaresStepState> = ({ setState, state: { question, squares } }) => {
  const updatePosition = useCallback((position) => {
    setState({
      position
    })
  }, [setState]);

  const updateSquares = useCallback((squares) => {
    setState({
      squares
    })
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
            <Form.Label>Question:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Describe what squares needs to be selected"
              onChange={updateQuestion}
              defaultValue={question}
            />
          </FormGroup>
          <FormGroup>
            <Form.Label>Selected squares:</Form.Label>
            {!_.isEmpty(squares) ?
              Object
                .keys(squares)
                .filter(square => squares[square].selected)
                .map(square => <h6>{square}</h6>) :
              <p className="text-muted">No square selected, use right click on the board.</p>
            }
          </FormGroup>
        </Col>
        <Col>
          <AdvancedChessboard
            tip="Setup position and select squares for the task"
            onChange={updatePosition}
            onSquaresUpdate={updateSquares}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Select squares</>;
};

const Playground: StepComponent<SelectSquaresStepState> = ({ setState, state }) => {
  return <>Select squares</>;
};

const Exercise: StepComponent<SelectSquaresStepState> = ({ setState, state }) => {
  return <>{state.title || 'Select squares'}</>;
};

const type = 'select-squares';

export {
  Editor,
  Picker,
  Playground,
  Exercise,
  type,
}
