import React from 'react';
import { ui, components } from '@application';
import styled from '@chess-tent/styled-props';

import Section from './section';

const { Row, Col, Container, Text } = ui;
const { Logo, Link } = components;

const Header = styled<{ className?: string }>(({ className }) => (
  <Section className={className} fill>
    <Container>
      <Row>
        <Col md={3}>
          <Logo />
          <Text fontSize="extra-small">A virtual chess gym for everyone.</Text>
        </Col>
        <Col md={{ offset: 3, span: 6 }}>
          <ul className="footer-links">
            <li>
              <Link to="/about" ghost>
                About
              </Link>
            </li>
            <li>Terms of Use</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <Text fontSize="extra-small">
            ChessTent 2022. All rights reserved
          </Text>
        </Col>
      </Row>
    </Container>
  </Section>
)).css`
  padding: 48px 0 24px;
  .footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      width: 50%;
      display: inline-block;
    }
  }
`;

export default Header;
