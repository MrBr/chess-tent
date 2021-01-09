import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { constants, services, ui } from '@application';
import { ChessboardFooterProps } from '@types';
import styled from '@emotion/styled';
import EditBoardToggle from './edit';

const { Button, Col, Row, Input, Label, Container } = ui;
const { MAX_BOARD_SIZE } = constants;
const { Chess } = services;

const chess = new Chess();

export default styled<FunctionComponent<ChessboardFooterProps>>(
  ({
    updateEditing,
    editing,
    onReset,
    onClear,
    onFENSet,
    className,
    position,
  }) => {
    const [fen, setFen] = useState<string>(position);

    useEffect(() => {
      setFen(position);
    }, [position]);

    const handleFenEnterKeypress = useCallback(
      event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const fenValid = chess.validate_fen(fen).valid;
          if (fenValid) {
            onFENSet(fen);
          }
          return;
        }
      },
      [fen, onFENSet],
    );
    const handleFenChange = useCallback(
      event => {
        setFen(event.target.value);
      },
      [setFen],
    );

    return (
      <Container className={className}>
        <Row noGutters className="justify-content-between">
          <Col className="col-auto">
            <EditBoardToggle editing={editing} onChange={updateEditing} />
          </Col>
          <Col className="col-auto">
            <Button
              size="extra-small"
              variant="regular"
              onClick={onReset}
              className="mr-3"
            >
              Reset
            </Button>
            <Button size="extra-small" variant="regular" onClick={onClear}>
              Clear
            </Button>
          </Col>
        </Row>
        <Row noGutters className="mt-3 align-items-center">
          <Col className="col-auto mr-2">
            <Label className="mb-0">FEN:</Label>
          </Col>
          <Col>
            <Input
              value={fen}
              onKeyPress={handleFenEnterKeypress}
              onChange={handleFenChange}
            />
          </Col>
        </Row>
      </Container>
    );
  },
)(
  {
    margin: '1em auto',
    maxWidth: MAX_BOARD_SIZE,
  },
  ({ width }) => ({ width }),
);
