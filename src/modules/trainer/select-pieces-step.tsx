import React, { FunctionComponent, useCallback, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import { Chess } from 'chess.js';
import _ from 'lodash';

import AdvancedChessboard, {
  AdvancedChessboardState,
} from './advanced-chessboard';
import { StepComponent } from '../app/types';
import { SquareKey } from '../chessboardjs';

interface SelectPiecesStepState {
  question: string;
  title: string;
  position: string;
  squares: AdvancedChessboardState['squares'];
}

const Editor: StepComponent<SelectPiecesStepState> = ({
  setState,
  state: { question, squares },
}) => {
  const advancedBoard = useRef<AdvancedChessboard>(null);
  const updatePosition = useCallback(
    (position, oldPosition, newPosition) => {
      setState({
        position,
      });
      (Object.keys(oldPosition) as SquareKey[]).forEach(square => {
        if (
          !(squares && squares[square] && squares[square].selected) ||
          oldPosition[square] === newPosition[square]
        ) {
          return;
        }

        advancedBoard &&
          advancedBoard.current &&
          advancedBoard.current.updateSquare(square, { selected: false });
      });
    },
    [setState],
  );

  const updateSquares = useCallback(
    squares => {
      setState({
        squares,
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

  const validateSelect = useCallback(square => {
    if (
      !advancedBoard.current ||
      !advancedBoard ||
      !advancedBoard.current.board.current
    ) {
      return false;
    }
    const fen = `${advancedBoard.current.board.current.fen()} w KQkq - 0 1`;
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
            <Form.Label>Selected squares:</Form.Label>
            {!_.isEmpty(squares) ? (
              Object.keys(squares)
                .filter(square => squares[square].selected)
                .map(square => <h6>{square}</h6>)
            ) : (
              <p className="text-muted">
                No pieces selected, use right click on the board.
              </p>
            )}
          </FormGroup>
        </Col>
        <Col>
          <AdvancedChessboard
            validateSelect={validateSelect}
            ref={advancedBoard}
            tip="Setup position and select pieces for the task"
            onChange={updatePosition}
            onSquaresUpdate={updateSquares}
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
