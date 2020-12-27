import React from 'react';
import { components, hooks, ui } from '@application';
import { Components } from '@types';

const { Container, Headline4, Row, Col } = ui;
const { useHistory } = hooks;
const { NotificationStand, UserSettings } = components;

const Header: Components['Header'] = () => {
  const history = useHistory();
  return (
    <Container fluid className="h-100">
      <Row className="h-100 align-items-center">
        <Col
          className="col-auto cursor-pointer"
          onClick={() => history.push('/')}
          xs={6}
        >
          <Headline4 className="m-0">CHESS TENT</Headline4>
        </Col>
        <Col className="d-flex justify-content-end" xs={6}>
          <NotificationStand />
          <UserSettings />
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
