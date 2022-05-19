import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { services, ui, hooks, constants } from '@application';
import { ChessboardFooterProps } from '@types';
import EditBoardToggle from './edit';

const {
  Modal,
  Button,
  Col,
  Row,
  Input,
  Tooltip,
  OverlayTrigger,
  FormGroup,
  Icon,
} = ui;
const { Chess, createNotableMovesFromGame } = services;
const { START_FEN } = constants;
const { usePrompt } = hooks;

const chess = new Chess();

const PGNModal = ({
  onImport,
  close,
}: {
  onImport: (pgn: string) => void;
  close: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImport = () => {
    close();
    if (inputRef.current) {
      onImport(inputRef.current.value);
    }
  };

  return (
    <Modal close={close} show>
      <Modal.Header>Import a PGN</Modal.Header>
      <Modal.Body>
        <FormGroup>
          <Input
            as="textarea"
            ref={inputRef}
            rows={25}
            placeholder="Paste PGN here"
            size="small"
          />
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleImport} size="small">
          Import
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

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
    const game = new Chess();
    let formattedPgn = pgn;
    if (/FEN/.test(pgn) && !/SetUp/.test(pgn)) {
      // Chess.js requires SetUp property in PGN to load the provided fen
      // This is a non-standard property and many PNGs doesn't have it even if the position isn't initial
      // Chess class has to change initial position to be able to produce valid moves if FEN is provided.
      formattedPgn = `[SetUp "1"]\n${formattedPgn}`;
    }
    game.load_pgn(formattedPgn);
    const moves = createNotableMovesFromGame(game);
    const headers = game.header();
    // Should always have FEN it makes life easier
    // TODO - make this typesafe
    headers.FEN = headers.FEN || START_FEN;
    const comments = game.get_comments();
    onPGN && onPGN(moves, headers, comments);
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
      <Row className="g-0 mt-4 align-items-center">
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
