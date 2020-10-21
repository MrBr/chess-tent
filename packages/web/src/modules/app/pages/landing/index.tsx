import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from './hero.png';

const { Link } = components;
const { Display2, Headline3, Container, Row, Col, Button, Text } = ui;

const Header = styled(Container)({
  backgroundImage: `url(${heroUrl})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top right',
  position: 'absolute',
  width: '1180px',
  height: '1167px',
  top: '-122px',
  right: 0,
});

const UnderlineText = styled(Text)({
  textDecoration: 'underline',
  color: 'gray',
});

export default () => (
  <>
    <Header fluid />
    <Row>
      <Col md={6} xs={12}>
        <Headline3>CHESS + TENT</Headline3>
        <Display2>Have serious skills and wish to teach chess?</Display2>
        <Headline3>
          Create engaging chess lessons and build your audience. <br />
          Join early beta and help us build flexible creator platform.
        </Headline3>
        <Button>
          <Text inline fontSize="large" weight={900}>
            Get beta access
          </Text>
        </Button>
        <Text>Want to learn from experienced chess coaches?</Text>
        <UnderlineText>Notify me when lessons go live?</UnderlineText>
      </Col>
    </Row>

    {/* <Link to="/login">Login</Link> */}
  </>
);
