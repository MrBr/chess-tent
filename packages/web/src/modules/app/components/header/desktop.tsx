import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';

const { Container, Row, Col } = ui;
const { NotificationStand, Invitation, ConversationsStand } = components;

const Header: Components['Header'] = () => {
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">
        <Col>Search</Col>
        <Col className="d-flex justify-content-end">
          <Invitation />
          <ConversationsStand />
          <NotificationStand />
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
