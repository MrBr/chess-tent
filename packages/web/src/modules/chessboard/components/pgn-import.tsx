import React, { useRef, useEffect } from 'react';
import { hoc, ui } from '@application';
import { FileUploaderProps } from '@types';

const { Modal, Button, Input, FormGroup, Label, Col, Row } = ui;
const { withFiles } = hoc;

const PGNModal = withFiles(
  ({
    onImport,
    close,
    files,
    openFileDialog,
  }: FileUploaderProps & {
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

    useEffect(() => {
      if (files.length < 1) {
        return;
      }
      files[0].text().then(pgn => {
        if (!inputRef.current) {
          return;
        }
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
              <Button size="extra-small" variant="ghost">
                Select file
              </Button>
            </Col>
          </Row>
          <FormGroup>
            <Input
              as="textarea"
              ref={inputRef}
              rows={20}
              size="small"
              placeholder="PGN"
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
  },
);

export default PGNModal;
