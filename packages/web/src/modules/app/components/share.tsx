import React, { useState, useRef, RefObject } from 'react';
import { hooks, ui, requests } from '@application';
import * as yup from 'yup';
import { Components } from '@types';

const { useApi } = hooks;
const {
  Button,
  Headline5,
  Input,
  Tooltip,
  Overlay,
  Row,
  Col,
  Form,
  Line,
  Offcanvas,
  Headline6,
  Container,
  Text,
} = ui;

const InvitationEmailSchema = yup.object().shape({
  email: yup.string().required(),
});

const Share: Components['Share'] = ({ close, title, link, description }) => {
  const { fetch } = useApi(requests.inviteUser);
  const target = useRef() as RefObject<HTMLButtonElement>;
  const [isLinkCopied, setLinkCopy] = useState(false);

  const HandleLinkCopy = () => {
    navigator.clipboard.writeText(link);
    setLinkCopy(true);
  };

  const handleSend = ({ email }: { email: string }) => {
    fetch({
      email,
      link: link,
    });
  };

  return (
    <Offcanvas onHide={close}>
      <Offcanvas.Header>
        <Headline5>{title}</Headline5>
      </Offcanvas.Header>
      <Offcanvas.Body className="mt-3">
        <Container>
          <Headline6>Share link</Headline6>
          <Row className="align-items-center">
            <Col className="col-sm-9 col-12">
              <Input value={link} className="mb-3" readOnly />
            </Col>
            <Col className="col-sm-3 col-12 mb-3">
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
              <Button
                className="py-2"
                ref={target}
                onClick={HandleLinkCopy}
                size="extra-small"
                variant="tertiary"
              >
                Copy
              </Button>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Text className="mt-3" fontSize="extra-small">
                {description}
              </Text>
            </Col>
          </Row>
          <Line />
          <Headline6 className="mt-4">Or send invite by email</Headline6>
          <Form
            initialValues={{
              email: '',
            }}
            validationSchema={InvitationEmailSchema}
            onSubmit={handleSend}
          >
            <Row className="mt-3 align-items-center">
              <Col>
                <Form.Input
                  size="small"
                  type="email"
                  name="email"
                  placeholder="Email"
                />
              </Col>
              <Col className="col-auto">
                <Button size="small" type="submit" variant="secondary">
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Share;
