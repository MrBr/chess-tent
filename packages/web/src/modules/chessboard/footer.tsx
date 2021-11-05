import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { services, ui } from '@application';
import { ChessboardFooterProps } from '@types';
import EditBoardToggle from './edit';

const { Button, Col, Row, Input, Label, Tooltip, OverlayTrigger } = ui;
const { Chess } = services;

const chess = new Chess();

const Footer: FunctionComponent<ChessboardFooterProps> = ({
  updateEditing,
  editing,
  onReset,
  onClear,
  onFENSet,
  onRotate,
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
    <>
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
          <Button
            size="extra-small"
            variant="regular"
            onClick={onClear}
            className="mr-3"
          >
            Clear
          </Button>
          <Button size="extra-small" variant="regular" onClick={onRotate}>
            Rotate
          </Button>
        </Col>
      </Row>
      <Row noGutters className="mt-3 align-items-center">
        <Col className="col-auto mr-2">
          <Label className="mb-0">FEN:</Label>
        </Col>
        <Col>
          <OverlayTrigger
            overlay={<Tooltip id="fen">Press enter to confirm</Tooltip>}
          >
            <Input
              value={fen}
              onKeyPress={handleFenEnterKeypress}
              onChange={handleFenChange}
            />
          </OverlayTrigger>
        </Col>
      </Row>
    </>
  );
};

export default Footer;
