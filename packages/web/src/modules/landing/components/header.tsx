import React from 'react';
import { ui } from '@application';
import styled from '@emotion/styled';
import { UIComponent } from '@types';

import headerLeftUrl from '../images/header-left.png';
import headerRightUrl from '../images/header-right.png';
import headerArrowUrl from '../images/header-arrow.svg';

import Button from './button';

const { Headline3, Row, Col, Container, Display2 } = ui;

const Header = styled<UIComponent>(({ className }) => (
  <Container className={className}>
    <Row>
      <Col md={{ offset: 2, span: 8 }}>
        <img src={headerLeftUrl} alt="" className="header-left" />
        <img src={headerRightUrl} alt="" className="header-right" />
        <img src={headerArrowUrl} alt="" className="header-arrow" />
        <Display2 className="text-center">
          Have serious skills and wish to teach chess?
        </Display2>
        <Headline3 className="text-center">
          Create engaging chess lessons and build your audience. Join early beta
          and help us build flexible creator platform.
        </Headline3>
        <Button className="m-auto d-block">Get beta access</Button>
      </Col>
    </Row>
  </Container>
))({
  '.header-left': {
    position: 'absolute',
    left: 0,
    transform: 'translateX(-100%)',
  },
  '.header-right': {
    position: 'absolute',
    right: 0,
    transform: 'translateX(100%)',
  },
  '.header-arrow': {
    position: 'absolute',
    right: 0,
    transform: 'translateX(100%)',
  },
});

export default Header;
