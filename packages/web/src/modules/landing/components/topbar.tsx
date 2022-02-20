import React, { useState } from 'react';
import styled, { useCss } from '@chess-tent/styled-props';
import { ui, components, utils } from '@application';

const { Row, Col, Container, Button, Icon } = ui;
const { Link, Logo } = components;
const { mobileCss } = utils;

const topbarCss = styled.props.isMenuOpen.css`
  height: 42px;
  margin-top: 20px;
  margin-bottom: 100px;

  > .row {
    height: 100%;
    align-items: center;
  }
  
  .hamburger {
    display: none;
  }
  
  .logo-container {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    color: var(--black-color);
    z-index: 2;
  }

  #menu {
    height: 100%;
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ${mobileCss`
    &.isMenuOpen {
      background: var(--bg-color);
    }
    
    .logo-container {
      flex: 1;
    }

    .hamburger {
      display: block;
      float: right;
      margin-right: 20px;
    }
    
    .menu-container {
      position: fixed;
      width: 100vw;
      height: 100vh;
      display: none;
      background: var(--bg-color);
      top: 0px;
      left: 0px;
      z-index: 1;
      padding-top: 120px;
    }

    .menu-actions {
      margin-top: 70px;
      &:before {
        width: 100px;
        position: absolute;
        top: -30px;
        content: '';
        border-top: 1px solid var(--grey-600-color);
      }
    }
    
    &.isMenuOpen .menu-container {
      display: block;
      > .row {
        flex-direction: column;
      }
    }
  `}
`;

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const className = useCss(topbarCss)({ isMenuOpen });
  return (
    <Container className={className}>
      <Row>
        <Col className="logo-container">
          <Link to="/">
            <Logo />
          </Link>
          <span
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Icon type={isMenuOpen ? 'close' : 'hamburger'} variant="black" />
          </span>
        </Col>
        <Col className="menu-container">
          <Row>
            <Col className="d-flex justify-content-center">
              <ul id="menu">
                <li>
                  <Link to="/about" ghost>
                    About
                  </Link>
                </li>
              </ul>
            </Col>
            <Col className="col-auto d-flex justify-content-center col menu-actions">
              <Link to="/login" ghost>
                <Button size="small" variant="ghost" className="mr-4">
                  Sign in
                </Button>
              </Link>
              <Link to="/register" ghost>
                <Button size="small">Sign up</Button>
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Topbar;
