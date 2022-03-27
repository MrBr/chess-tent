import React from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';

const { Container, Headline4, Row, Col } = ui;
const { useHistory } = hooks;
const {
  NotificationStand,
  TabBar,
  UserSettings,
  Invitation,
  ConversationsStand,
} = components;

const Header: Components['Header'] = () => {
  const history = useHistory();
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">
        <Col
          className="col-auto cursor-pointer"
          onClick={() => history.push('/')}
          xs={3}
        >
          <Headline4 className="m-0">CHESS TENT</Headline4>
        </Col>
        <Col className="h-100 d-flex" xs={6}>
          <TabBar />
        </Col>

        <Col className="d-flex justify-content-end" xs={3}>
          <Invitation />
          <ConversationsStand />
          <NotificationStand />
          <UserSettings />
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
