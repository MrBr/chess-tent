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
  ModalBody,
  Button,
  Col,
  Row,
  Input,
  Label,
  Tooltip,
  OverlayTrigger,
  FormGroup,
} = ui;
const { Chess, createNotableMovesFromGame } = services;
const { START_FEN } = constants;
const { usePromptModal } = hooks;

const chess = new Chess();

const PGNModal = ({
  onImport,
  close,
}: {
  onImport: (pgn: string) => void;
  close: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>();
  const handleImport = () => {
    close();
    if (inputRef.current) {
      onImport(inputRef.current.value);
    }
  };

  return (
    <Modal close={close} show>
      <ModalBody>
        <Label>Import a game</Label>
        <FormGroup>
          <Input
            as="textarea"
            ref={inputRef}
            rows={25}
            placeholder="Paste PGN here"
            size="small"
          />
        </FormGroup>
        <Button onClick={handleImport} size="small">
          Import
        </Button>
      </ModalBody>
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
  const promptModal = usePromptModal();
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
            onClick={() =>
              promptModal(close => (
                <PGNModal close={close} onImport={handlePGN} />
              ))
            }
            className="me-3"
            disabled={!onPGN}
          >
            PGN
          </Button>
          <Button
            size="extra-small"
            variant="regular"
            onClick={onReset}
            className="me-3"
          >
            Reset
          </Button>
          <Button
            size="extra-small"
            variant="regular"
            onClick={onClear}
            className="me-3"
          >
            Clear
          </Button>
          <Button size="extra-small" variant="regular" onClick={onRotate}>
            Rotate
          </Button>
        </Col>
      </Row>
      <Row noGutters className="mt-3 align-items-center">
        <Col className="col-auto me-2">
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
