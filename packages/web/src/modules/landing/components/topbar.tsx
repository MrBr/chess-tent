import React from 'react';
import { ui, components } from '@application';

const { Button, Row, Col, Container } = ui;
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
          <Button className="py-3 px-5">Login</Button>
        </Link>
      </Col>
    </Row>
  </Container>
);
export default Topbar;
