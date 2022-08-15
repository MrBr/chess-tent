import React from 'react';
import { components, ui } from '@application';
import styled from '@chess-tent/styled-props';

import Section from './section';
import pawnsSrc from '../images/pawns.svg';

const { Row, Col, Container, Headline3, Button } = ui;
const { Link } = components;

const CTA = styled<{ className?: string }>(({ className }) => (
  <Section className={className}>
    <Container>
      <Row>
        <Col md={7}>
          <Headline3 color="light" className="mb-2">
            Want to learn from experienced chess coaches? Join us!
          </Headline3>
        </Col>
        <Col
          md={{ offset: 1, span: 4 }}
          className="d-flex align-items-center justify-content-end"
        >
          <Link to="/register" ghost>
            <Button>Sign up</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  </Section>
)).css`
  padding: 100px 0;
  background-color: var(--black-color);
  background-image: url(${pawnsSrc});
  background-repeat: no-repeat;
  background-position: left center;
  background-size: auto 110%;
`;

export default CTA;
