import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

const { Container, Row, Col, Icon } = ui;
const { useHistory } = hooks;

const Menu: Components['Menu'] = () => {
  const history = useHistory();
  return (
    <Container>
      <Row className="flex-column">
        <Col>
          <Icon type="logo" onClick={() => history.push('/')} />
        </Col>
        <Col>
          <Icon type="notification" onClick={() => history.push('/coaches')} />
        </Col>
        <Col>
          <Icon type="notification" onClick={() => history.push('/lessons')} />
        </Col>
        <Col>
          <Icon type="notification" />
        </Col>
        <Col>
          <Icon type="notification" />
        </Col>
      </Row>
    </Container>
  );
};

export default Menu;
