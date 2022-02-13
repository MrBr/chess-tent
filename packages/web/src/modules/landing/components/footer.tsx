import React from 'react';
import { ui, components } from '@application';
import styled from '@chess-tent/styled-props';

import Section from './section';

const { Row, Col, Container, Text } = ui;
const { Logo } = components;

const Header = styled<{ className?: string }>(({ className }) => (
  <Section className={className} fill>
    <Container>
      <Row>
        <Col md={3}>
          <Logo />
          <Text align="center" fontSize="extra-small">
            Create engaging chess lessons and build your audience. Join early
            beta and help us build flexible creator platform.
          </Text>
        </Col>
        <Col md={{ offset: 3, span: 6 }}>
          <ul className="footer-links">
            <li>About</li>
            <li>Terms of Use</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={3}>
          <Text fontSize="extra-small">
            ChessTent 2022. All rights reserved
          </Text>
        </Col>
      </Row>
    </Container>
  </Section>
)).css`
  .footer-links {
    list-style: none;
    li {
      width: 50%;
      display: inline-block;
    }
  }
`;

export default Header;
