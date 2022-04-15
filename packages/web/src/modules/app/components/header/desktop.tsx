import React from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';

const { Container, Row, Col, Button } = ui;
const { NotificationStand, Invitation, ConversationsStand } = components;
const { useHistory } = hooks;

const Header: Components['Header'] = () => {
  const history = useHistory();
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">
        <Col>Search</Col>
        <Col className="d-flex align-items-center justify-content-end">
          <ConversationsStand />
          <NotificationStand />
          <Invitation />
          <Button
            onClick={() => history.push('/lesson/new')}
            size="extra-small"
            variant="secondary"
          >
            New template
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
