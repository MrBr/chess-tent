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
            <li>
              <Link to="/contact" ghost>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/terms-of-services.txt" target="_blank" ghost>
                Terms of Services
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy.txt" target="_blank" ghost>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: 'https://www.facebook.com/chesstent' }}
                target="_blank"
                ghost
              >
                Facebook
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: 'https://www.instagram.com/chess.tent/' }}
                target="_blank"
                ghost
              >
                Instagram
              </Link>
            </li>
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
