import React from 'react';
import { ui, utils, hooks } from '@application';
import styled from '@emotion/styled';

import heroUrl from '../../images/hero.png';
import lessonsUrl from '../../images/lessons.png';
import boardSrc from '../../images/board.svg';
import brainSrc from '../../images/brain.svg';
import kingSrc from '../../images/king.svg';

const { useHistory } = hooks;

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

const { mediaQueryEnhancer } = utils;

const Header = styled(Container)(
  {
    background: `url(${heroUrl}) no-repeat top right`,
    position: 'absolute',
    right: 0,
    height: '100vh',
    backgroundSize: 'auto 100%',
  },
  mediaQueryEnhancer('md', {
    backgroundSize: '70% auto',
  }),
  mediaQueryEnhancer('lg', {
    backgroundSize: '70% auto',
  }),
  mediaQueryEnhancer('sm', {
    backgroundSize: '80% auto',
  }),
  mediaQueryEnhancer('xs', {
    backgroundSize: 'auto 250px',
  }),
);

const FirstSectionTextCol = styled(Col)(
  mediaQueryEnhancer('xl', {
    marginTop: '10.0625em',
  }),
);

const Lesson = styled.div({
  background: `url(${lessonsUrl}) no-repeat center`,
  paddingTop: 'calc(100% * 0.63)',
  minHeight: '100%',
  backgroundSize: '100% auto',
});

const SectionRow = styled(Row)(
  { height: 'auto' },
  mediaQueryEnhancer('xl', {
    height: '100vh',
  }),
);

const VerticalLine = styled.div({
  borderRight: '1px solid #E4E4E4',
  position: 'absolute',
  left: '50%',
  top: '20%',
  height: '60%',
  width: 1,
});

const LoginButton = styled(Button)(
  {
    position: 'absolute',
    right: '3rem',
    // Headline3 margin top
    top: '2.75rem',
    zIndex: 2,
  },
  mediaQueryEnhancer('xs', {
    right: '1rem',
  }),
);

export const LandingPage = () => {
  const history = useHistory();
  return (
    <Container fluid className="pb-5">
      <LoginButton className="py-3 px-5" onClick={() => history.push('/login')}>
        Login
      </LoginButton>
      <Header fluid />
      <SectionRow noGutters>
        <Col
          md={{ span: 5, offset: 1 }}
          lg={{ span: 6, offset: 1 }}
          sm={8}
          xs={12}
        >
          <Row noGutters className="mt-4">
            <Col xs={6}>
              <Headline3>CHESS TENT</Headline3>
            </Col>
          </Row>
          <Col className="d-sm-none" xs={12}>
            <Img src={heroUrl} height="160" className="invisible" />
          </Col>
          <FirstSectionTextCol xs={12}>
            <Display2>Have serious skills and wish to teach chess?</Display2>
            <Headline3>
              Create engaging chess lessons and build your audience. Join early
              beta and help us build flexible creator platform.
            </Headline3>
            <Button
              className="mt-4 py-4 px-5 my-md-4 my-lg-4 py-lg-4 px-lg-5"
              onClick={() => history.push('/register')}
            >
              Get beta access
            </Button>
          </FirstSectionTextCol>
        </Col>
      </SectionRow>
      <Row className="my-sm-4 my-md-5 my-lg-5 my-xl-0">
        <Col
          md={{ span: 5, offset: 1 }}
          lg={{ span: 5, offset: 1 }}
          sm={12}
          className="my-4 my-sm-4 order-1 order-sm-0"
        >
          <Img src={kingSrc} height="72px" />
          <Headline1>Create Engaging Lessons and Build Your Audience</Headline1>
          <Headline3>Express yourself as if the board is real!</Headline3>
          <Text>
            Anyone who trained chess knows how much questions needs to be asked
            in a lesson or a training and for the first time you can do it.
          </Text>
          <Text>
            Create the most interactive online lessons and training. Become
            visible to chess players.
          </Text>
          <Button
            className="mt-5 py-4 px-5 my-sm-4 my-md-4 my-lg-4 py-lg-4 px-lg-5"
            onClick={() => history.push('/register')}
          >
            Become a Coach
          </Button>
        </Col>
        <Col
          md={{ span: 6 }}
          lg={6}
          sm={12}
          className="my-5 mb-sm-0 order-0 order-sm-1"
        >
          <Lesson />
        </Col>
      </Row>
      <Row noGutters className="mt-5 mb-5 my-lg-5">
        <Col md={{ span: 4, offset: 1 }} lg={{ span: 4, offset: 1 }} sm={12}>
          <Img src={brainSrc} height="72px" />
          <Headline1>Get a coach!</Headline1>
          <Headline3>
            Unique lessons editor provides a simple way to create custom
            tailored trainings and lessons.
          </Headline3>
          <Text>
            <b>Live training</b> - the best way to improve your chess skills.
            Coach guides and tailors training that fits your skill. Train in the
            real time online.
          </Text>
          <Text>
            <b>Solo training</b> - practice when you can. Solve standalone
            lessons or get custom tailored training by your new mentor.
          </Text>
        </Col>
        <Col md={2} xs={12} lg={2} sm={2} className="position-relative">
          <VerticalLine />
        </Col>
        <Col md={4} lg={4} sm={12}>
          <Img src={boardSrc} height="72px" />
          <Headline1>Find a lesson</Headline1>
          <Headline3>
            Interactive chess lessons designed to help you learn to adopt chess
            thinking.
          </Headline3>
          <Text>
            Alongside with step by step explanation, lessons are composed of
            tasks that aim to develop chess thinking.
          </Text>
          <Text>
            You will encounter questions such as select weak squares or strong
            pieces, who stands better, set up pieces and similar.
          </Text>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
