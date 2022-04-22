import React, { useState, useRef, useEffect, RefObject } from 'react';
import { hooks, ui, requests } from '@application';
import * as yup from 'yup';

import { APP_DOMAIN } from '../../api';

const { useApi, useActiveUserRecord } = hooks;
const {
  Button,
  Modal,
  Input,
  Tooltip,
  Overlay,
  Row,
  Col,
  Form,
  FormGroup,
  Headline3,
} = ui;

const InvitationEmailSchema = yup.object().shape({
  email: yup.string().required(),
});

const Invitation = () => {
  const { fetch } = useApi(requests.inviteUser);
  const { value: activeUser } = useActiveUserRecord();
  const target = useRef() as RefObject<HTMLButtonElement>;
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLinkCopied, setLinkCopy] = useState(false);

  const invitationLink = `${APP_DOMAIN}/register?referrer=${activeUser.id}`;

  const HandleLinkCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setLinkCopy(true);
  };

  const handleSend = ({ email }: { email: string }) => {
    fetch({
      email,
      link: invitationLink,
    });
  };

  useEffect(() => {
    setLinkCopy(false);
  }, [isModalVisible]);

  const contentText = activeUser.coach ? 'Invite student' : 'Invite friend';
  return (
    <div className="h-25 me-3">
      <Button
        onClick={() => setModalVisibility(true)}
        size="extra-small"
        variant="text"
      >
        Invite
      </Button>
      <Modal close={() => setModalVisibility(false)} show={isModalVisible}>
        <Modal.Header>{contentText}</Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="col-sm-9 col-12">
              <Input value={invitationLink} className="mb-3" readOnly />
            </Col>
            <Col className="col-sm-3 col-12 mb-3">
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
            <Col className="col-12">
              <Headline3 className="mt-1 mb-1">
                Send an invitation email
              </Headline3>
              <Form
                initialValues={{
                  email: '',
                }}
                validationSchema={InvitationEmailSchema}
                onSubmit={handleSend}
              >
                <FormGroup className="pt-4">
                  <Form.Input
                    size="medium"
                    type="email"
                    name="email"
                    placeholder="Email address"
                  />
                </FormGroup>

                <Button size="small" type="submit">
                  Send
                </Button>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invitation;
