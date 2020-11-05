import React from 'react';
import { components, ui } from '@application';
import styled from '@emotion/styled';

import heroUrl from '../../images/hero.png';
import lessonsUrl from '../../images/lessons.png';
import boardSrc from '../../images/board.svg';
import brainSrc from '../../images/brain.svg';
import kingSrc from '../../images/king.svg';

const { Link } = components;
const {
  Display2,
  Headline3,
  Container,
  Row,
  Col,
  Button,
  Text,
  Headline1,
  Img,
} = ui;

const Header = styled(Container)({
  background: `url(${heroUrl}) no-repeat top right`,
  position: 'absolute',
  width: '1180px',
  height: '1167px',
  right: 0,
  '@media (max-width: 1199px)': {
    height: '900px',
    backgroundSize: '70% auto',
  },
  '@media (max-width: 991px)': {
    backgroundSize: '686px 724px',
  },
  '@media (max-width: 768px)': {
    backgroundSize: '486px 624px',
  },
  '@media (max-width: 576px)': {
    backgroundSize: '286px 224px',
  },
});

const Lesson = styled.div({
  background: `url(${lessonsUrl}) no-repeat top center`,
  height: '100%',
  backgroundSize: '100% auto',
  '@media (max-width: 1200px)': {
    backgroundPosition: 'center',
    height: '100%',
  },
  '@media (max-width: 768px)': {
    height: '509px',
    backgroundSize: '100% auto',
    backgroundPosition: 'center',
  },
});

const SectionRow = styled(Row)({
  height: '1167px',
  '@media (max-width: 1199px)': {
    height: 'auto',
  },
  '@media (max-width: 991px)': {
    height: 'auto',
  },
  '@media (max-width: 576px)': {
    height: 'auto',
  },
});

const ContentRow = styled(Row)({
  marginTop: '10.0625em',
  '@media (max-width: 1200px)': {
    marginTop: '5em',
  },
  '@media (max-width: 991px)': {
    marginTop: '1em',
  },
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
  <Container fluid className="pb-5">
    <Header fluid />
    <SectionRow noGutters>
      <Col
        md={{ span: 5, offset: 1 }}
        lg={{ span: 6, offset: 1 }}
        sm={8}
        xs={12}
      >
        <Row noGutters>
          <Headline3>CHESS TENT</Headline3>
        </Row>
        <ContentRow
          noGutters
          className="flex-column align-items-start justify-content-md-between"
        >
          <Display2>Have serious skills and wish to teach chess?</Display2>
          <Headline3>
            Create engaging chess lessons and build your audience. Join early
            beta and help us build flexible creator platform.
          </Headline3>
          <Button className="my-md-4 my-lg-4 py-lg-4 px-lg-5">
            Get beta access
          </Button>
        </ContentRow>
      </Col>
    </SectionRow>
    <Row className="my-sm-4 my-md-5 my-lg-5 my-xl-0">
      <Col
        md={{ span: 5, offset: 1 }}
        lg={{ span: 5, offset: 1 }}
        sm={12}
        className="my-sm-4"
      >
        <Img src={kingSrc} height="72px" />
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
        <Button className="my-sm-4 my-md-4 my-lg-4 py-lg-4 px-lg-5">
          Become a Coach
        </Button>
      </Col>
      <Col md={{ span: 6 }} lg={6} sm={12} className="mb-sm-0">
        <Lesson />
      </Col>
    </Row>
    <Row noGutters className="mb-5 my-lg-5">
      <Col md={{ span: 4, offset: 1 }} lg={{ span: 4, offset: 1 }} sm={12}>
        <Img src={brainSrc} height="72px" />
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
      <Col md={2} xs={12} lg={2} sm={2} className="position-relative">
        <VerticalLine />
      </Col>
      <Col md={4} lg={4} sm={12} className="mt-xs-5 mt-sm-5">
        <Img src={boardSrc} height="72px" />
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
