import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from '../../images/hero.png';
import lessonsUrl from '../../images/lessons.png';

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
  background: `url(${heroUrl}) no-repeat top right`,
  position: 'absolute',
  width: '1180px',
  height: '1167px',
  right: 0,
  '@media (max-width: 576px)': {
    backgroundSize: '286px 224px',
  },
});

const Lesson = styled.div({
  background: `url(${lessonsUrl}) no-repeat top right`,
  height: '869px',
  '@media (max-width: 576px)': {
    height: '309px',
    backgroundSize: '360px 309px',
  },
});

const SectionRow = styled(Row)({
  height: '1167px',
});

const ContentRow = styled(Row)({
  marginTop: '10.0625em',
});

const VerticalLine = styled.div({
  borderRight: '1px solid #E4E4E4',
  position: 'absolute',
  left: '50%',
  top: '20%',
  height: '60%',
  width: 1,
});

export const LandingPage = () => (
  <Container fluid>
    <Header fluid />
    <SectionRow noGutters>
      <Col md={{ span: 4, offset: 1 }} xs={12}>
        <Row noGutters>
          <Headline3>CHESS TENT</Headline3>
        </Row>
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
        </ContentRow>
      </Col>
    </SectionRow>
    <Row>
      <Col md={{ span: 3, offset: 1 }} xs={12}>
        <Icon type="king" size="large" />
        <Headline1>Create Engaging Lessons and Build Your Audience</Headline1>
        <Headline3>
          Full express yourself in the context of online chess teaching.
        </Headline3>
        <Text>
          Anyone who trained a chess know how much questions needs to be asked
          in a lesson or a training and for the first time you can do it.
        </Text>
        <Text>
          Create the most interactive online lessons and training. Become
          visible to chess players.
        </Text>
        <Button className="my-lg-4">
          <Text inline fontSize="large" weight={900} className="mx-xl-5">
            Become a Coach
          </Text>
        </Button>
      </Col>
      <Col md={{ span: 8 }} xs={12}>
        <Lesson />
      </Col>
    </Row>
    <Row noGutters className="mb-5 ">
      <Col md={{ span: 3, offset: 1 }} xs={12}>
        <Icon type="brain" size="large" />
        <Headline1>Get a coach!</Headline1>
        <Headline3>
          Unique lessons editor provides students and coaches simple way to
          create custom tailored trainings and lessons.
        </Headline3>
        <Text>
          <b>Live training</b> - the best way to improve your chess skills.
          Coach guides and tailors training that fits your skill. Train in real
          time online.
        </Text>
        <Text>
          <b>Solo training</b> - live experience for those with less time. Coach
          will still guide you through your learning but with steady peace.
        </Text>
      </Col>
      <Col md={{ span: 3 }} xs={12} className="position-relative">
        <VerticalLine />
      </Col>
      <Col md={{ span: 3 }} xs={12}>
        <Icon type="board" size="large" />
        <Headline1>Find a lesson</Headline1>
        <Headline3>
          Interactive chess lessons designed to help you learn how to adopt
          chess thinking.
        </Headline3>
        <Text>
          Alongside with step by step explanation, lessons are composed of tasks
          that aim to develop chess thinking.
        </Text>
        <Text>
          You will encounter questions such as select weak squares or strong
          pieces, who stands better, set up pieces and similar.
        </Text>
      </Col>
    </Row>
    <Link style={{ position: 'fixed', top: 0 }} to="/login">
      Login
    </Link>
  </Container>
);

export default LandingPage;
