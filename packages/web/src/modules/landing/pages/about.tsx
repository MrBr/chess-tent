import React from 'react';
import { ui, components, utils } from '@application';
import { css } from '@chess-tent/styled-props';

import lukaSrc from '../images/contributors/luka.png';
import bozidarSrc from '../images/contributors/bozidar.jpeg';
import mendeSrc from '../images/contributors/mende.jpeg';
import alenSrc from '../images/contributors/alen.jpeg';
import anteSrc from '../images/contributors/ante.jpeg';
import sandroSrc from '../images/contributors/sandro.jpeg';
import tomislavSrc from '../images/contributors/tomislav.png';
import borisSrc from '../images/contributors/boris.jpeg';
import antonioSrc from '../images/contributors/antonio.png';
import tihanaSrc from '../images/contributors/tihana.jpeg';

import Topbar from '../components/topbar';
import Section from '../components/section';
import Footer from '../components/footer';
import CTA from '../components/cta';
import Underline from '../components/underline';

const {
  Headline5,
  Headline2,
  Container,
  Row,
  Col,
  Text,
  Headline6,
  Page,
  Hero,
  Button,
  Icon,
  Headline3,
} = ui;
const { mobileCss } = utils;
const { Link } = components;

const { className } = css`
  .user-stats {
    > * {
      padding-top: 2em;
      padding-bottom: 2em;
    }
    > *:first-child {
      border-right: 1px solid var(--grey-400-color);
      border-bottom: 1px solid var(--grey-400-color);
    }
    > *:last-child {
      // Align borders
      margin: -1px 0 0 -1px;
      border-top: 1px solid var(--grey-400-color);
      border-left: 1px solid var(--grey-400-color);
    }
  }

  .card {
    width: 100%;
    height: 100%;
    background: var(--light-color);
    border: 1px solid rgba(107, 114, 128, 0.08);
    box-sizing: border-box;
    border-radius: 16px;
    padding: 2em;
  }

  .code-stats {
    flex-direction: column;
    > * {
      padding-left: 2em;
      border-left: 3px solid var(--grey-400-color);
      margin-bottom: 2em;
    }
  }

  .contributor {
    width: 100%;
    height: 100%;
    background: var(--light-color);
    box-sizing: border-box;
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 2em;
    img {
      width: 100%;
      max-height: 246px;
      object-fit: cover;
    }
  }
`;

export const LandingPage = () => {
  return (
    <Page className={className}>
      <Topbar />
      <Section>
        <Container>
          <Row>
            <Col md={{ offset: 2, span: 8 }}>
              <Hero align="center">
                Chess Tent is an expression of{' '}
                <Text inherit className="position-relative d-inline-block">
                  <Underline />
                  an idea
                </Text>
              </Hero>
              <Text align="center" fontSize="large">
                Idea of a fair and transparent product which is primarily built
                for the people. We live in times where things are free but with
                a hidden cost and this is attempt to make a change.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>

      <Section fill>
        <Container>
          <Row>
            <Col>
              <Headline2>Platform</Headline2>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Text fontSize="small">
                Product as a platform means users can both consume and
                create/sell content. Chess tent will try to develop those tools
                that help both consumers and creators to express themselves and
                grow in the context of chess.
              </Text>
            </Col>
            <Col className="col-auto">
              <Button>Start creating</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="edit" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Editor</Headline5>
              <Text fontSize="small">
                The most powerful tool for preparing chess lessons
              </Text>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="board" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Playground</Headline5>
              <Text fontSize="small">
                The best place for online chess practice
              </Text>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="video" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Video conference</Headline5>
              <Text fontSize="small">
                Interactive chess board and video conference all in one{' '}
              </Text>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="chat" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Conversations</Headline5>
              <Text fontSize="small">In app chat for brief discussions</Text>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="support" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Group training</Headline5>
              <Text fontSize="small">
                Group trainings beyond over the board experience
              </Text>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <Icon type="settings" background variant="secondary" />
              <Headline5 className="mt-4 mb-4">Engine</Headline5>
              <Text fontSize="small">
                Stockfish 14 integrated with the board
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>

      <Section>
        <Container>
          <Row>
            <Col md={5} sm={12}>
              <Row className="user-stats">
                <Col xs={6}>
                  <Headline3 align="center">3</Headline3>
                  <Text align="center">Lessons</Text>
                </Col>
                <Col xs={6}>
                  <Headline3 align="center">...</Headline3>
                  <Text align="center">Training</Text>
                </Col>
                <Col xs={6}>
                  <Headline3 align="center">4</Headline3>
                  <Text align="center">Coaches</Text>
                </Col>
                <Col xs={6}>
                  <Headline3 align="center">...</Headline3>
                  <Text align="center">Students</Text>
                </Col>
              </Row>
            </Col>
            <Col md={{ offset: 1, span: 6 }} sm={12}>
              <Headline2>Community driven</Headline2>
              <Text fontSize="small">
                Being a part of the community provides a set of rights and
                responsibilities. The only responsibility in this context is a
                monthly subscription for the active users. This will be
                discussed more in the times ahead. For the time being (beta
                version) everything remains free.
              </Text>
            </Col>
          </Row>
        </Container>
      </Section>

      <Section fill>
        <Container>
          <Row>
            <Col xs={6} md={4} className="d-flex align-items-center">
              <Headline2>
                To our users we
                <span className="d-inline-block position-relative">
                  <Underline />
                  provide
                </span>
                :
              </Headline2>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <div className="card">
                <Icon type="board" background variant="secondary" />
                <Headline5 className="mt-4 mb-4">Zero purchase fees</Headline5>
                <Text fontSize="small">
                  The best place for online chess practice
                </Text>
              </div>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <div className="card">
                <Icon type="video" background variant="secondary" />
                <Headline5 className="mt-4 mb-4">Adless service</Headline5>
                <Text fontSize="small">
                  Interactive chess board and video conference all in one{' '}
                </Text>
              </div>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <div className="card">
                <Icon type="chat" background variant="secondary" />
                <Headline5 className="mt-4 mb-4">
                  Participation in the decision making
                </Headline5>
                <Text fontSize="small">In app chat for brief discussions</Text>
              </div>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <div className="card">
                <Icon type="support" background variant="secondary" />
                <Headline5 className="mt-4 mb-4">
                  Free for those in need
                </Headline5>
                <Text fontSize="small">
                  Group trainings beyond over the board experience
                </Text>
              </div>
            </Col>
            <Col xs={6} md={4} className="mt-4 mb-4">
              <div className="card">
                <Icon type="settings" background variant="secondary" />
                <Headline5 className="mt-4 mb-4">
                  Open source codebase
                </Headline5>
                <Text fontSize="small">
                  Stockfish 14 integrated with the board
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
      </Section>

      <Section>
        <Container>
          <Row>
            <Col md={7} xs={12}>
              <Headline2>Open source</Headline2>
              <Text fontSize="small">
                We are building a first class application and want other
                engineers to help achieve that. Open source pushes us to deliver
                better code and leaves a lot more room to learn. This platform
                would have never been built if there weren’t other pioneers that
                provided open source tools and we hope to give something back to
                the community.
              </Text>
            </Col>
            <Col md={{ offset: 2, span: 3 }} xs={12}>
              <Row className="code-stats">
                <Col>
                  <Headline3>800+</Headline3>
                  <Text>Commits</Text>
                </Col>
                <Col>
                  <Headline3>12500+</Headline3>
                  <Text>Lines</Text>
                </Col>
                <Col>
                  <Headline3>5+</Headline3>
                  <Text>Developers</Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Section>

      <Section fill>
        <Container>
          <Row>
            <Col>
              <Headline2 className="mb-5">Contributors</Headline2>
            </Col>
          </Row>
          <Row>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={lukaSrc} alt="Luka Bracanović - Chess Tent founder" />
                <Headline5 align="center" className="mt-3 mb-1">
                  Luka Bracanović
                </Headline5>
                <Text fontSize="small" align="center">
                  The founder
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={anteSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Ante Machiedo
                </Headline5>
                <Text fontSize="small" align="center">
                  Developer
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={alenSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Alen Šljivar
                </Headline5>
                <Text fontSize="small" align="center">
                  Developer
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={sandroSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Sandro Šafar
                </Headline5>
                <Text fontSize="small" align="center">
                  Chess Coach (content)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={tihanaSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Tihana Iveković
                </Headline5>
                <Text fontSize="small" align="center">
                  Chess Coach (content)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={bozidarSrc} alt=" - " />
                <Headline5 align="center" className="mt-3 mb-1">
                  Božidar Iveković
                </Headline5>
                <Text fontSize="small" align="center">
                  Chess Coach (content)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={mendeSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Mende Mitrovski
                </Headline5>
                <Text fontSize="small" align="center">
                  Designer (logo)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={tomislavSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Tomislav Milanović
                </Headline5>
                <Text fontSize="small" align="center">
                  Developer
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={borisSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Boris Belonjek
                </Headline5>
                <Text fontSize="small" align="center">
                  Design (v1)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={borisSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Zoia Vasina
                </Headline5>
                <Text fontSize="small" align="center">
                  Design (v2)
                </Text>
              </div>
            </Col>
            <Col md={4} xs={6} className="mb-5">
              <div className="contributor">
                <img src={antonioSrc} />
                <Headline5 align="center" className="mt-3 mb-1">
                  Antonio Martinović
                </Headline5>
                <Text fontSize="small" align="center">
                  Developer
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Row className="mb-5">
            <Col md={{ offset: 2, span: 8 }}>
              <Headline6 color="secondary" align="center">
                We stand on the shoulders of giants
              </Headline6>
              <Headline3 align="center" className="mt-3 mb-3">
                Thanks to all the people that inspired
              </Headline3>
              <Text fontSize="small" align="center">
                We are passionate about our business and strive to provide the
                best service possible. We truly appreciate your support. Thank
                you!
              </Text>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <div className="card">
                <Text fontSize="small">
                  I want to thank my coach. Many hours spent over the board
                  working with prof. Gazarek inspired the Chess Tent. Endless
                  enthusiasm and affection towards chess with longing for change
                  pushed me forward to be the change.
                </Text>
                <Text fontSize="base" weight={700}>
                  prof. Danko Gazarek
                </Text>
                <Text fontSize="small">Chess coach and professor</Text>
              </div>
            </Col>
            <Col md={4}>
              <div className="card">
                <Text fontSize="small">
                  Special thanks go to the online platform which changed the
                  world of chess unimaginably. Making a free top notch product
                  inspired me to create community driven platform. <br /> P.S.
                  thanks for the chessground.
                </Text>
                <Text fontSize="base" weight={700}>
                  <a href="https://lichess.com">Lichess</a>
                </Text>
                <Text fontSize="small">Free gaming platform</Text>
              </div>
            </Col>
            <Col md={4}>
              <div className="card">
                <Text fontSize="small">
                  All this wouldn't be possible without countless developers
                  providing open source code. Things taken for granted used to
                  build the web as we know and making a way for new generations.
                  Thanks go to all the contributors.
                </Text>
                <Text fontSize="base" weight={700}>
                  Open source community
                </Text>
                <Text fontSize="small">Developers rocks!</Text>
              </div>
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
