import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from './hero.png';
import lessonsUrl from './lessons.png';

const { Link } = components;
const {
  Display2,
  Headline3,
  Container,
  Row,
  Col,
  Button,
  Text,
  Icon,
  Headline1,
} = ui;

const Header = styled(Container)({
  // backgroundImage: `url(${heroUrl})`,
  // backgroundRepeat: 'no-repeat',
  // backgroundPosition: 'top right',
  background: `url(${heroUrl}) no-repeat top right`,
  // backgroundAttachment: 'fixed',
  position: 'absolute',
  width: '1180px',
  height: '1167px',
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

const SectionRow = styled(Row)({
  height: '1167px',
});

const ContentRow = styled(Row)({
  marginTop: '10.0625em',
});

export default () => (
  <Container fluid className="pl-5">
    <Header fluid />
    <SectionRow noGutters>
      <Col md={{ span: 5 }} xs={12}>
        <Row noGutters>
          <Headline3>CHESS + TENT</Headline3>
        </Row>
        {/* <Icon type="logo" size="large" /> */}
        <ContentRow
          noGutters
          className="flex-column align-items-start justify-content-md-between"
        >
          <Display2>Have serious skills and wish to teach chess?</Display2>
          <Headline3>
            Create engaging chess lessons and build your <br />
            audience. Join early beta and help us build flexible <br />
            creator platform.
          </Headline3>
          <Button className="my-lg-4">
            <Text inline fontSize="large" weight={900} className="mx-xl-5">
              Get beta access
            </Text>
          </Button>
          <Text>Want to learn from experienced chess coaches?</Text>
          <UnderlineText>Notify me when lessons go live?</UnderlineText>
        </ContentRow>
      </Col>
    </SectionRow>
    <Row>
      <Col md={{ span: 5 }} xs={12}>
        <Icon type="king" size="large" />
        <Headline1>Create Engaging Lessons and Build Your Audience</Headline1>
        <Headline3>
          Full express yourself in the context of online chess teaching.
        </Headline3>
        <Text fontSize="large">
          Anyone who trained a chess know how much questions needs to be asked
          in a lesson or a training and for the first time you can do it.
        </Text>
        <Text fontSize="large">
          Create the most interactive online lessons and training. Become
          visible to chess players.
        </Text>
        <Button className="my-lg-4">
          <Text inline fontSize="large" weight={900} className="mx-xl-5">
            Become a Coach
          </Text>
        </Button>
      </Col>
      <Col md={{ span: 7 }} xs={12}>
        <Lesson />
      </Col>
    </Row>
    {/* <Row noGutters>
      <Col md={{ span: 6, offset: 1 }} xs={12}>
        <Icon type="brain" size="large" />
        <Icon type="board" size="large" />
      </Col>
    </Row> */}

    <Link style={{ position: 'fixed', top: 0 }} to="/login">
      Login
    </Link>
  </Container>
);
