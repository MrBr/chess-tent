import React from 'react';
import { ui } from '@application';
import styled from '@emotion/styled';
import { UIComponent } from '@types';

import headerLeftUrl from '../images/header-left.png';
import headerRightUrl from '../images/header-right.png';
import headerArrowUrl from '../images/header-arrow.svg';

const { Row, Col, Container, Hero, Text, Button } = ui;

const Header = styled<UIComponent>(({ className }) => (
  <Container className={className}>
    <Row>
      <Col md={{ offset: 2, span: 8 }}>
        <img src={headerLeftUrl} alt="" className="header-left" />
        <img src={headerRightUrl} alt="" className="header-right" />
        <img src={headerArrowUrl} alt="" className="header-arrow" />
        <Hero align="center">
          Have serious skills and wish to teach{' '}
          <Text color="primary">chess?</Text>
        </Hero>
        <Text align="center" fontSize="large">
          Create engaging chess lessons and build your audience. Join early beta
          and help us build flexible creator platform.
        </Text>
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
