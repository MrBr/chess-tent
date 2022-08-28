import React from 'react';
import { ui, components, utils } from '@application';
import { css } from '@chess-tent/styled-props';

import lessonsUrl from '../images/lessons.png';
import getACoachUrl from '../images/get-a-coach.png';
import editorUrl from '../images/editor.png';
import trainingRoomUrl from '../images/training-room.png';

import Topbar from '../components/topbar';
import Section from '../components/section';
import Footer from '../components/footer';
import CTA from '../components/cta';
import Underline from '../components/underline';
import headerLeftUrl from '../images/header-left.png';
import headerRightUrl from '../images/header-right.png';
import headerArrowUrl from '../images/header-arrow.svg';

const {
  Headline3,
  Headline2,
  Container,
  Row,
  Col,
  Text,
  Headline1,
  Img,
  Hero,
  Button,
  Icon,
  Line,
  Badge,
} = ui;
const { mobileCss } = utils;
const { Link } = components;

const { className } = css`
  .header-left {
    position: absolute;
    left: 0;
    transform: translateX(-100%) translateY(-50%);
    width: 170px;
  }
  .header-right {
    position: absolute;
    right: 0;
    transform: translateX(100%) translateY(-100%);
    width: 130px;
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
    <Container fluid className={className}>
      <Topbar />
      <Section>
        <Container>
          <Row>
            <Col md={{ offset: 2, span: 8 }} className="position-relative">
              <img src={headerLeftUrl} alt="" className="header-left" />
              <img src={headerRightUrl} alt="" className="header-right" />
              <Hero align="center">
                Learn and teach{' '}
                <Text
                  color="primary"
                  inherit
                  className="position-relative d-inline-block"
                >
                  <img src={headerArrowUrl} alt="" className="header-arrow" />
                  <Underline />
                  chess
                </Text>
              </Hero>
              <Text align="center" fontSize="large">
                Let's get you started. Pick the best option for yourself!
              </Text>
            </Col>
            <Row className="justify-content-center">
              <Col className="col-auto mt-4">
                <Link to="/register?flow=student" ghost>
                  <Button variant="ghost">Connect with mentor</Button>
                </Link>
              </Col>
              <Col className="col-auto mt-4">
                <Link to="/register?flow=practice" ghost>
                  <Button variant="ghost">Learn on your own</Button>
                </Link>
              </Col>
              <Col className="col-auto mt-4">
                <Link to="/register?flow=teach" ghost>
                  <Button variant="ghost">Be mentor</Button>
                </Link>
              </Col>
            </Row>
          </Row>
        </Container>
      </Section>
      <Section fill>
        <Container>
          <Row>
            <Col
              md={6}
              sm={12}
              className="d-flex flex-column justify-content-center"
            >
              <Headline2>Connect with mentor</Headline2>
              <Text fontSize="small" className="my-4">
                The best way to improve your chess skill and break plateau is
                with a{' '}
                <Text weight={500} inline>
                  mentor
                </Text>
                . Mentor can guide you in the process, create custom tailored
                lessons and teach in real time or asynchronously.
              </Text>
              <div className="mb-5">
                <Link to="/register" ghost>
                  <Button>Let's find you a mentor</Button>
                </Link>
              </div>
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
          <Line />
          <Headline3 className="mb-4 mt-5">Practice modes</Headline3>
          <Row>
            <Col>
              <Text weight={500}>🚀 Live training</Text>
              <Text>
                The best way to improve your chess skills. Coach guides and
                tailors training that fits your skill in real time online.
              </Text>
            </Col>
            <Col>
              <Text weight={500}>📖 Individual program</Text>
              <Text>
                Coach creates a lesson specifically for you, based on your level
                and type of play. Solve the lesson at your own pace and
                communicate with coach through the comments.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Row>
            <Col
              md={6}
              sm={12}
              className="d-flex flex-column justify-content-center"
            >
              <Headline2>Prefer learning alone?</Headline2>
              <Text fontSize="small" className="my-4">
                No problem! We understand everyone has an unique way of learning
                and got your back. Our official team of coaches is working hard
                to create free public lessons.
              </Text>
              <div className="mb-5">
                <Link to="/register" ghost>
                  <Button>Start practicing</Button>
                </Link>
              </div>
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
          <Headline3 align="center" className="mb-3 mt-5 pt-5">
            Lesson structure
          </Headline3>
          <Row className="pt-5 g-0">
            <Col className="text-center">
              <Badge className="mb-3 px-3">
                <Text className="m-0">👨🏼‍🏫</Text>
              </Badge>
              <Text weight={700} align="center">
                Explanation
              </Text>
              <Text align="center">Learn about a topic</Text>
            </Col>
            <Col className="text-center">
              <Badge className="mb-3 px-3">
                <Text className="m-0">📖</Text>
              </Badge>
              <Text weight={700} align="center">
                Example
              </Text>
              <Text align="center">See the topic in practice</Text>
            </Col>
            <Col className="text-center">
              <Badge className="mb-3 px-3">
                <Text className="m-0">💡</Text>
              </Badge>
              <Text weight={700} align="center">
                Exercise
              </Text>
              <Text align="center">Solve tasks and learn</Text>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section fill>
        <Container>
          <Row>
            <Col
              md={{ offset: 2, span: 8 }}
              sm={12}
              className="d-flex flex-column justify-content-center"
            >
              <Headline1 align="center">Are you a coach?</Headline1>
              <Text align="center" className="mt-4 mb-5">
                Already have chess experience that you’d like to share? Awesome,
                we need you here! Our platform offers a variety of tools to help
                you teach in the best possible way.
              </Text>
              <Link to="/register" ghost className="text-center">
                <Button>Become mentor</Button>
              </Link>
            </Col>
          </Row>
          <Row className="my-5 py-5">
            <Col className="flex-column justify-content-center d-flex">
              <Text
                className="mb-0"
                weight={500}
                fontSize="extra-small"
                color="secondary"
              >
                Coach tools
              </Text>
              <Headline3>Editor</Headline3>
              <Text className="mb-4">
                Prepare content for private trainings or public lessons.
              </Text>
              <ul className="list-unstyled">
                <Text fontSize="small" as="li" className="mb-3">
                  <Icon type="check" variant="primary" size="small" /> Explain a
                  topic
                </Text>
                <Text fontSize="small" as="li" className="mb-3">
                  <Icon type="check" variant="primary" size="small" /> Show a
                  real example
                </Text>
                <Text fontSize="small" as="li">
                  <Icon type="check" variant="primary" size="small" /> Create
                  interactive exercises
                </Text>
              </ul>
            </Col>
            <Col>
              <img src={editorUrl} alt="Editor example" />
            </Col>
          </Row>
          <Row>
            <Col>
              <img src={trainingRoomUrl} alt="Training room example" />
            </Col>
            <Col className="flex-column justify-content-center d-flex">
              <Text
                className="mb-0 mt-4"
                weight={500}
                fontSize="extra-small"
                color="secondary"
              >
                Coach tools
              </Text>
              <Headline3>Training room</Headline3>
              <Text className="mb-4">
                Work together with your students in real time or asynchronously.
              </Text>
              <ul className="list-unstyled">
                <Text fontSize="small" as="li" className="mb-3">
                  <Icon type="check" variant="primary" size="small" /> Video
                  conference
                </Text>
                <Text fontSize="small" as="li" className="mb-3">
                  <Icon type="check" variant="primary" size="small" />{' '}
                  Interactive board
                </Text>
                <Text fontSize="small" as="li">
                  <Icon type="check" variant="primary" size="small" />{' '}
                  Discussion
                </Text>
              </ul>
            </Col>
          </Row>
        </Container>
      </Section>
      <CTA />
      <Footer />
    </Container>
  );
};

export default LandingPage;
