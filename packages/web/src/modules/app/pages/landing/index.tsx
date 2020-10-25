import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from './hero.png';
import lessonsUrl from './lessons.png';

const { Link } = components;
const { Display2, Headline3, Container, Row, Col, Button, Text, Icon } = ui;

const Header = styled(Container)({
  // backgroundImage: `url(${heroUrl})`,
  // backgroundRepeat: 'no-repeat',
  // backgroundPosition: 'top right',
  background: `url(${heroUrl}) no-repeat top right`,
  // backgroundAttachment: 'fixed',
  position: 'absolute',
  width: '1180px',
  minHeight: '100vh',
  // top: '-122px',
  right: 0,
});

const Lesson = styled.div({
  background: `url(${lessonsUrl}) no-repeat top right`,
  height: '869px',
});

const UnderlineText = styled(Text)({
  textDecoration: 'underline',
  color: 'gray',
});

const PageRow = styled(Row)({
  height: '100vh',
});

export default () => (
  <>
    <Header fluid />
    <PageRow noGutters>
      <Col md={{ span: 6, offset: 1 }} xs={12}>
        {/* <Headline3>CHESS + TENT</Headline3> */}
        <Icon type="logo" size="large" />
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
    </PageRow>
    <Lesson />
    {/* <Row noGutters>
      <Col md={{ span: 6, offset: 1 }} xs={12}>
        <Icon type="king" size="large" />
      </Col>
    </Row>
    <Row noGutters>
      <Col md={{ span: 6, offset: 1 }} xs={12}>
        <Icon type="brain" size="large" />
        <Icon type="board" size="large" />
      </Col>
    </Row> */}

    {/* <Link to="/login">Login</Link> */}
  </>
);
