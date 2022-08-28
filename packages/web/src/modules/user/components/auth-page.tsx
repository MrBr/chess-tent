import React, { ReactNode } from 'react';
import { css } from '@chess-tent/styled-props';
import { ui, hooks, components, utils } from '@application';

const { Redirect, Link, Logo } = components;
const { Container, Col, Row, Page } = ui;
const { mobileCss } = utils;

const { className } = css`
  ${Logo} {
    margin: 40px 0 100px;
  }
  .registration-form {
    background-color: var(--light-color);
  }
  .registration-tips {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    top: 0;
  }
  ${mobileCss`
    ${Logo} {
      position: fixed;
      color: var(--light-color);
      z-index: 2;
    }
    .registration-form {
      position: absolute;
      border-radius: 16px 16px 0 0;
      top: 210px;
      left: 0;
      margin-left: 0;
      z-index: 3;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .registration-tips {
      width: 100%;
      z-index: 1;
      height: 315px;
      position: fixed;
    }
  `}
`;

const PageAuth = ({
  children,
  tips,
}: {
  children: ReactNode;
  tips: ReactNode;
}) => {
  const { value: user } = hooks.useActiveUserRecord(null);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Page className={className}>
      <Container className="h-100">
        <Row>
          <Col>
            <Link to="/">
              <Logo />
            </Link>
          </Col>
        </Row>
        <Row className="overflow-y-auto registration-form">
          <Col md={5} xs={12}>
            {children}
          </Col>
        </Row>
        <Container className="registration-tips" fluid>
          {tips}
        </Container>
      </Container>
    </Page>
  );
};

export default PageAuth;
