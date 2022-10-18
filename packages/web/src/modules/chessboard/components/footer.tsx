import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { services, ui, hooks } from '@application';
import { ChessboardFooterProps } from '@types';

import EditBoardToggle from './edit';
import PGNModal from './pgn-import';

const { Col, Row, Input, Tooltip, OverlayTrigger, Icon } = ui;
const { Chess } = services;
const { usePrompt } = hooks;

const chess = new Chess();

const Footer: FunctionComponent<ChessboardFooterProps> = ({
  updateEditing,
  editing,
  onReset,
  onClear,
  onFENSet,
  onRotate,
  position,
  onPGN,
}) => {
  const handlePGN = (pgn: string) => {
    onPGN && onPGN(pgn);
  };

  const [pgnModalElem, promptModal] = usePrompt(close => (
    <PGNModal close={close} onImport={handlePGN} />
  ));
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
      {pgnModalElem}
      <Row className="g-0 justify-content-between">
        <Col className="col-auto">
          <EditBoardToggle editing={editing} onChange={updateEditing} />
        </Col>
        <Col className="col-auto">
          <OverlayTrigger overlay={<Tooltip>Reset board</Tooltip>}>
            <Icon type="refresh" onClick={onReset} />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Clear board</Tooltip>}>
            <Icon type="clear" onClick={onClear} />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Rotate</Tooltip>}>
            <Icon type="rotate" onClick={onRotate} />
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Import PGN</Tooltip>}>
            <Icon type="document" onClick={promptModal} />
          </OverlayTrigger>
        </Col>
      </Row>
      <Row className="g-0 mt-2 align-items-center">
        <OverlayTrigger
          overlay={<Tooltip id="fen">Press enter to confirm</Tooltip>}
        >
          <Col>
            <Input
              value={fen}
              onKeyPress={handleFenEnterKeypress}
              onChange={handleFenChange}
            />
          </Col>
        </OverlayTrigger>
      </Row>
    </>
  );
};

export default Footer;
