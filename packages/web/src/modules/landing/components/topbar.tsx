import React from 'react';
import { ui, components } from '@application';

import Button from './button';

const { Row, Col, Container } = ui;
const { Link, Logo } = components;

const Topbar = () => (
  <Container>
    <Row>
      <Col>
        <Logo />
      </Col>
      <Col>
        <ul id="menu">
          <li>About</li>
        </ul>
      </Col>
      <Col>
        <Link to="/login" ghost>
          <Button>Login</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);
export default Topbar;
