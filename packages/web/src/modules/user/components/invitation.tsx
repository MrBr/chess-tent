import React, { useState, useRef } from 'react';
import { hooks, ui, requests } from '@application';
import { User } from '@chess-tent/models';

import { APP_DOMAIN } from '../../api';

const { useApi, useActiveUserRecord } = hooks;
const { Button, Modal, Input, Tooltip, Overlay, Check, Label, Row, Col } = ui;

export default () => {
  const { fetch } = useApi(requests.inviteUser);
  const [activeUser] = useActiveUserRecord() as [User, never, never];
  const target = useRef();
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLinkCopied, setLink] = useState(false);
  const [isMentor, setMentor] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const invitationLink = `${APP_DOMAIN}/register?referrer=${activeUser.id}${
    isMentor ? `&mentorship=${isMentor}` : ''
  }`;
  const HandleLinkCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setLink(true);
  };

  const handleSend = () => {
    fetch({
      email,
      name,
      link: invitationLink,
    });
  };

  const ContentText = 'Invite student';
  return (
    <div className="h-25 mr-3 mt-3">
      <Button
        onClick={() => setModalVisibility(true)}
        size="extra-small"
        variant="regular"
      >
        {ContentText}
      </Button>
      <Modal close={() => setModalVisibility(false)} show={isModalVisible}>
        <Modal.Header>{ContentText}</Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-sm-9 col-12">
              <Input value={invitationLink} className="mb-3" />
            </Col>
            <Col className="col-sm-3 col-12">
              <Button
                className="py-2"
                ref={target}
                onClick={HandleLinkCopy}
                size="extra-small"
              >
                Copy link
              </Button>
            </Col>
            <Overlay
              //@ts-ignore
              target={target.current}
              show={isLinkCopied}
              placement="right"
            >
              {props => (
                <Tooltip {...props} id="copy-link">
                  Link copied
                </Tooltip>
              )}
            </Overlay>
          </Row>
          <Row>
            <Col className="col-12 mb-3">
              <Check
                checked={isMentor}
                onChange={() => setMentor(!isMentor)}
                label="Mentorship"
              />
            </Col>
          </Row>
          <Row>
            <Col className="col-12">
              <Label>Name:</Label>
              <Input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </Col>
            <Col className="col-12">
              <Label>Email:</Label>
              <Input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </Col>
            <Col className="col-12 mt-3">
              <Button size="small" onClick={handleSend}>
                Send
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};
