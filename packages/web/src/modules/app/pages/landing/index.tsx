import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from './hero.png';

const { Link } = components;
const { Display2, Headline1, Headline4, Container, Row, Col, Button } = ui;

const Header = styled(Container)({
  backgroundImage: `url(${heroUrl})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  height: 1080,
  padding: '0 100px',
});

export default () => (
  <>
    <Header fluid>
      <Headline1>CHESS TENT</Headline1>
      <Row>
        <Col md={6}>
          <Display2>Have serious skills and wish to teach chess?</Display2>
          <Headline4>
            Create engaging chess lessons and build your audience. <br />
            Join early beta and help us build flexible creator platform.
          </Headline4>
          <Button>Get beta access</Button>
        </Col>
      </Row>
    </Header>
    <Link to="/login">Login</Link>
  </>
);
