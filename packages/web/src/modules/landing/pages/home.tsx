import React from 'react';
import { ui, components, utils } from '@application';
import { css } from '@chess-tent/styled-props';

import lessonsUrl from '../images/lessons.png';
import getACoachUrl from '../images/get-a-coach.png';
import findALesson from '../images/find-a-lesson.png';

import Topbar from '../components/topbar';
import Section from '../components/section';
import Footer from '../components/footer';
import CTA from '../components/cta';
import Underline from '../components/underline';
import headerLeftUrl from '../images/header-left.png';
import headerRightUrl from '../images/header-right.png';
import headerArrowUrl from '../images/header-arrow.svg';

const {
  Headline5,
  Headline2,
  Container,
  Row,
  Col,
  Text,
  Headline1,
  Img,
  Page,
  Hero,
  Button,
  Icon,
} = ui;
const { mobileCss } = utils;
const { Link } = components;

const { className } = css`
  .header-left {
    position: absolute;
    left: 0;
    transform: translateX(-100%) translateY(100%);
    width: 170px;
  }
  .header-right {
    position: absolute;
    right: 0;
    transform: translateX(100%) translateY(-70%);
  }
  .header-arrow {
    position: absolute;
    right: 0;
    transform: translateX(110%) translateY(-30%);
  }

  ${mobileCss`
    .header-left {
      position: absolute;
      left: 10px;
      transform: translateY(-115%);
      width: 80px;
    }
    .header-right {
      position: absolute;
      right: 10px;
      top: 0;
      transform: translateY(-110%);
      width: 65px;
    }

    img.section-image {
      width: 100%;
    }
  `}
`;

export const LandingPage = () => {
  return (
    <Page className={className}>
      <Topbar />
      <Section>
        <Container>
          <Row>
            <Col md={{ offset: 2, span: 8 }}>
              <img src={headerLeftUrl} alt="" className="header-left" />
              <img src={headerRightUrl} alt="" className="header-right" />
              <Hero align="center">
                Have serious skills and wish to teach{' '}
                <Text
                  color="primary"
                  inherit
                  className="position-relative d-inline-block"
                >
                  <img src={headerArrowUrl} alt="" className="header-arrow" />
                  <Underline />
                  chess?
                </Text>
              </Hero>
              <Text align="center" fontSize="large">
                Create engaging chess lessons and build your audience. Join
                early beta and help us build flexible creator platform.
              </Text>
              <Button className="m-auto d-block">Get beta access</Button>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section fill>
        <Container>
          <Row>
            <Col md={6} sm={12}>
              <Text fontSize="small" color="secondary" weight={700}>
                Express yourself as if the board is real!
              </Text>
              <Headline2>
                Create Engaging Lessons and Build Your Audience
              </Headline2>
              <Text fontSize="small">
                Anyone who trained chess knows how much questions needs to be
                asked in a lesson or a training and for the first time you can
                do it.
              </Text>
              <Text fontSize="small">
                Create the most interactive online lessons and training. Become
                visible to chess players.
              </Text>
              <Link to="/register" ghost>
                <Button>Become a Coach</Button>
              </Link>
            </Col>
            <Col md={{ offset: 1, span: 5 }} sm={12}>
              <Img
                src={lessonsUrl}
                alt=""
                width="auto"
                className="section-image"
              />
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Row>
            <Col md={6} sm={12}>
              <Headline2>Get a coach!</Headline2>
              <Text fontSize="small" weight={700}>
                Unique lessons editor provides a simple way to create custom
                tailored trainings and lessons.
              </Text>
              <Headline5>
                <Icon
                  type="pawn"
                  variant="primary"
                  className="me-2"
                  size="large"
                />
                Live training
              </Headline5>
              <Text>
                The best way to improve your chess skills. Coach guides and
                tailors training that fits your skill. Train in the real time
                online.
              </Text>
              <Headline5>
                <Icon
                  type="board"
                  variant="primary"
                  className="me-2"
                  size="large"
                />
                Solo training
              </Headline5>
              <Text>
                Practice when you can. Solve standalone lessons or get custom
                tailored training by your new mentor.
              </Text>
            </Col>
            <Col md={{ offset: 1, span: 5 }} sm={12}>
              <Img
                src={getACoachUrl}
                alt=""
                width="auto"
                className="section-image"
              />
            </Col>
          </Row>
        </Container>
      </Section>

      <Section>
        <Container>
          <Row>
            <Col md={5} sm={12} className="order-1 order-md-0">
              <Img
                src={findALesson}
                alt=""
                className="float-end section-image"
                width="auto"
              />
            </Col>
            <Col
              md={{ offset: 1, span: 6 }}
              sm={12}
              className="order-0 order-md-1"
            >
              <Headline1>Find a lesson</Headline1>
              <Text weight={700}>
                Interactive chess lessons designed to help you learn to adopt
                chess thinking.
              </Text>
              <Text>
                Alongside with step by step explanation, lessons are composed of
                tasks that aim to develop chess thinking.
              </Text>
              <Text>
                You will encounter questions such as select weak squares or
                strong pieces, who stands better, set up pieces and similar.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>
      <CTA />
      <Footer />
    </Page>
  );
};

export default LandingPage;
