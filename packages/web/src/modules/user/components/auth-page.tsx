import React, { ReactNode } from 'react';
import { css } from '@chess-tent/styled-props';
import { ui, hooks, components } from '@application';

import boardHeroSrc from '../images/board-hero.png';

const { Redirect, Link, Logo } = components;
const { Container, Col, Row, Page } = ui;

const { className } = css`
  ${Logo} {
    margin: 40px 0 100px;
  }
  .auth-hero {
    object-fit: cover;
    width: auto;
    height: 100vh;
  }
`;

export default ({ children }: { children: ReactNode }) => {
  const { value: user } = hooks.useActiveUserRecord(null);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Page className={className}>
      <Container>
        <Row>
          <Col md={5} xs={12}>
            <Row>
              <Col>
                <Link to="/">
                  <Logo />
                </Link>
              </Col>
            </Row>
            {children}
          </Col>
          <Col md={{ offset: 1, span: 6 }} className="d-md-block d-none">
            <img src={boardHeroSrc} alt="" className="auth-hero" />
          </Col>
        </Row>
      </Container>
    </Page>
  );
};
