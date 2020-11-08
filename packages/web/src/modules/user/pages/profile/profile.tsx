import React from 'react';
import { components, ui } from '@application';
import { User } from '@chess-tent/models';

const { UserAvatar, Layout } = components;
const { Col, Row, Headline3, Headline4, Text } = ui;

export default ({ user }: { user: User }) => {
  return (
    <Layout>
      <Row>
        <Col className="col-auto mt-4">
          <UserAvatar user={user} size="large" />
        </Col>
        <Col>
          <Headline3>{user.name}</Headline3>
          <Text>{user.punchline}</Text>
          <Text>{user.studentElo}</Text>
          <Text className="text-uppercase" fontSize="small">
            Pricing
          </Text>
          <Text>{user.pricing}</Text>
          <Text className="text-uppercase" fontSize="small">
            Availability
          </Text>
          <Text>{user.availability}</Text>
          <Text className="text-uppercase" fontSize="small">
            Speciality
          </Text>
          <Text>{user.speciality}</Text>
        </Col>
        <Col>
          <Headline4>About me</Headline4>
          <Text>{user.about}</Text>
        </Col>
        <Col>
          <Headline4>Playing experience</Headline4>
          <Text>{user.playingExperience}</Text>
        </Col>
        <Col>
          <Headline4>Teaching experience</Headline4>
          <Text>{user.playingExperience}</Text>
          <Headline4>Teaching methodology</Headline4>
          <Text>{user.teachingMethodology}</Text>
        </Col>
      </Row>
    </Layout>
  );
};
