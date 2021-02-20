import React, { useState, useRef, useEffect } from 'react';
import { hooks, ui, requests } from '@application';
import { User } from '@chess-tent/models';
import * as yup from 'yup';

import { APP_DOMAIN } from '../../api';

const { useApi, useActiveUserRecord } = hooks;
const {
  Button,
  Modal,
  Input,
  Tooltip,
  Overlay,
  Check,
  Row,
  Col,
  Form,
  FormGroup,
  Headline3,
} = ui;

const InvitationEmailSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email('Invalid email').required(),
});

export default () => {
  const { fetch } = useApi(requests.inviteUser);
  const [activeUser] = useActiveUserRecord() as [User, never, never];
  const target = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isLinkCopied, setLinkCopy] = useState(false);
  const [isMentor, setMentor] = useState(true);

  const invitationLink = `${APP_DOMAIN}/register?referrer=${activeUser.id}${
    isMentor ? `&mentorship=${isMentor}` : ''
  }`;
  const HandleLinkCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setLinkCopy(true);
  };

  const handleSend = ({ name, email }: { name: string; email: string }) => {
    fetch({
      email,
      name,
      link: invitationLink,
    });
  };

  useEffect(() => {
    setLinkCopy(false);
  }, [isMentor, isModalVisible]);

  const ContentText = activeUser.coach ? 'Invite student' : 'Invite friend';
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
              <Headline3 className="mt-1 mb-1">
                Send an invitation email
              </Headline3>
              <Form
                initialValues={{
                  name: '',
                  email: '',
                }}
                validationSchema={InvitationEmailSchema}
                onSubmit={handleSend}
              >
                <FormGroup className="pt-4">
                  <Form.Input
                    size="large"
                    type="text"
                    name="name"
                    placeholder="Name"
                  />
                </FormGroup>
                <FormGroup className="pt-4">
                  <Form.Input
                    size="large"
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
