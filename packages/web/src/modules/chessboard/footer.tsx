import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { services, ui, hooks } from '@application';
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
const { Chess, createNotableMovesFromHistory } = services;
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
    game.load_pgn(pgn);
    const history = game.history({ verbose: true });
    const moves = createNotableMovesFromHistory(history);
    const headers = game.header();
    onPGN && onPGN(moves, headers);
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
            className="mr-3"
          >
            PGN
          </Button>
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
