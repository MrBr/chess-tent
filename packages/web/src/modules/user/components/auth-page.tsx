import React, { ReactNode } from 'react';
import { css } from '@chess-tent/styled-props';
import { ui, hooks, components } from '@application';

const { Redirect, Link, Logo } = components;
const { Container, Col, Row, Page } = ui;

const { className } = css`
  ${Logo} {
    margin: 40px 0 100px;
  }
  .registration-sidebar {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    top: 0;
  }
`;

const PageAuth = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) => {
  const { value: user } = hooks.useActiveUserRecord(null);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Page className={className}>
      <Container className="h-100">
        <Row className="overflow-y-auto">
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
        </Row>
        <div className="registration-sidebar">{sidebar}</div>
      </Container>
    </Page>
  );
};

export default PageAuth;
