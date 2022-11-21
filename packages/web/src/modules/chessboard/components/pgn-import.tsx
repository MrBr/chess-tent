import React, { useRef, useEffect, useState } from 'react';
import { hoc, ui } from '@application';
import { FileUploaderProps } from '@types';

const {
  Modal,
  Button,
  Input,
  FormGroup,
  Label,
  Col,
  Row,
  Text,
  OverlayTrigger,
  Tooltip,
} = ui;
const { withFiles } = hoc;

const CharsLimit = 50000;

const PGNModal = withFiles(
  ({
    onImport,
    close,
    files,
    openFileDialog,
  }: FileUploaderProps & {
    onImport: (pgn: string, asChapters: boolean) => void;
    close: () => void;
  }) => {
    const [charsCount, setCharsCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const isValidPgn = charsCount <= CharsLimit;

    const handleImport = (asChapters = false) => {
      if (!inputRef.current) {
        return;
      }
      if (inputRef.current.value.length > CharsLimit) {
        alert('PGN file too big!');
        return;
      }
      try {
        onImport(inputRef.current.value, asChapters);
        close();
      } catch (e) {
        alert(e);
      }
    };

    useEffect(() => {
      if (files.length < 1) {
        return;
      }
      files[0].text().then(pgn => {
        if (!inputRef.current) {
          return;
        }
        setCharsCount(pgn.length);
        inputRef.current.value = pgn;
      });
    }, [files]);

    return (
      <Modal close={close} show>
        <Modal.Header>Import a PGN</Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col>
              <Label>Copy PGN text or from file</Label>
            </Col>
            <Col className="col-auto">
              <Button
                size="extra-small"
                variant="ghost"
                onClick={openFileDialog}
              >
                Select file
              </Button>
            </Col>
          </Row>
          <FormGroup>
            <Input
              onChange={e => setCharsCount(e.currentTarget.value.length)}
              as="textarea"
              ref={inputRef}
              rows={20}
              size="small"
              placeholder="PGN"
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Col>
            <Text className="mb-0" fontSize="extra-small">
              Size limit:
            </Text>
            <Text
              color={isValidPgn ? 'black' : 'error'}
              fontSize="smallest"
              className="mb-0"
            >
              {charsCount}/{CharsLimit}
            </Text>
          </Col>
          <OverlayTrigger overlay={<Tooltip>Create new chapter(s)</Tooltip>}>
            <span>
              <Button
                onClick={() => handleImport(true)}
                size="extra-small"
                variant="tertiary"
                className="me-3"
              >
                Add chapters
              </Button>
            </span>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip>Add variations to the current chapter</Tooltip>}
          >
            <span>
              <Button onClick={() => handleImport(false)} size="extra-small">
                Add steps
              </Button>
            </span>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>
    );
  },
);

export default PGNModal;
