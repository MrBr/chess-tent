import React from 'react';
import { ui, components } from '@application';
import { css } from '@chess-tent/styled-props';

import lessonsUrl from '../images/lessons.png';
import getACoachUrl from '../images/get-a-coach.png';
import findALesson from '../images/find-a-lesson.png';

import Topbar from '../components/topbar';
import Header from '../components/header';
import Section from '../components/section';
import Button from '../components/button';

const { Headline3, Container, Row, Col, Text, Headline1, Img, Page } = ui;
const { Link } = components;

const { className } = css`
  @media screen and (max-width: 768px) {
    img {
      width: 100%;
    }
  }
`;

export const LandingPage = () => {
  return (
    <Page className={className}>
      <Topbar />
      <Section>
        <Header />
      </Section>
      <Section alt>
        <Container>
          <Row>
            <Col md={6} sm={12}>
              <Headline3>Express yourself as if the board is real!</Headline3>
              <Headline1>
                Create Engaging Lessons and Build Your Audience
              </Headline1>
              <Text>
                Anyone who trained chess knows how much questions needs to be
                asked in a lesson or a training and for the first time you can
                do it.
              </Text>
              <Text>
                Create the most interactive online lessons and training. Become
                visible to chess players.
              </Text>
              <Link to="/register" ghost>
                <Button>Become a Coach</Button>
              </Link>
            </Col>
            <Col md={{ offset: 1, span: 5 }} sm={12}>
              <Img src={lessonsUrl} alt="" width="auto" />
            </Col>
          </Row>
        </Container>
      </Section>
      <Section>
        <Container>
          <Row>
            <Col md={6} sm={12}>
              <Headline1>Get a coach!</Headline1>
              <Headline3>
                Unique lessons editor provides a simple way to create custom
                tailored trainings and lessons.
              </Headline3>
              <Text>Live training</Text>
              <Text>
                The best way to improve your chess skills. Coach guides and
                tailors training that fits your skill. Train in the real time
                online.
              </Text>
              <Text>Solo training</Text>
              <Text>
                Practice when you can. Solve standalone lessons or get custom
                tailored training by your new mentor.
              </Text>
            </Col>
            <Col md={{ offset: 1, span: 5 }} sm={12}>
              <Img src={getACoachUrl} alt="" width="auto" />
            </Col>
          </Row>
        </Container>
      </Section>

      <Section>
        <Container>
          <Row>
            <Col md={5} sm={12}>
              <Img
                src={findALesson}
                alt=""
                className="float-right"
                width="auto"
              />
            </Col>
            <Col md={{ offset: 1, span: 6 }} sm={12}>
              <Headline1>Find a lesson</Headline1>
              <Headline3>
                Interactive chess lessons designed to help you learn to adopt
                chess thinking.
              </Headline3>
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
    </Page>
  );
};

export default LandingPage;
