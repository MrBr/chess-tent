import React from 'react';
import { ui, components } from '@application';

const { Row, Col, Container, Button } = ui;
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
          <Button size="small">Login</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);
export default Topbar;
