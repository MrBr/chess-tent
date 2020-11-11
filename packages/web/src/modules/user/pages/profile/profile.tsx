import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';

const { UserAvatar, Layout } = components;
const { useHistory } = hooks;
const { Col, Row, Headline3, Headline4, Text, Absolute, Button } = ui;

export default ({ user, editable }: { user: User; editable?: boolean }) => {
  const history = useHistory();
  return (
    <Layout>
      <Row>
        {editable && (
          <Absolute bottom={25} right={25}>
            <Button
              variant="regular"
              onClick={() =>
                history.push({
                  pathname: history.location.pathname,
                  search: '?edit=true',
                })
              }
            >
              Edit
            </Button>
          </Absolute>
        )}
        <Col className="col-auto mt-4">
          <UserAvatar user={user} size="large" />
        </Col>
        <Col>
          <Headline3>{user.name}</Headline3>
          {user.coach && (
            <>
              <Text>{user.state.punchline}</Text>
              <Text>{user.state.studentElo}</Text>
              <Text className="text-uppercase" fontSize="small">
                Pricing
              </Text>
              <Text>{user.state.pricing}</Text>
              <Text className="text-uppercase" fontSize="small">
                Availability
              </Text>
              <Text>{user.state.availability}</Text>
              <Text className="text-uppercase" fontSize="small">
                Speciality
              </Text>
              <Text>{user.state.speciality}</Text>
            </>
          )}
        </Col>
        <Col>
          <Headline4>About me</Headline4>
          <Text>{user.state.about}</Text>
        </Col>
        <Col>
          <Headline4>Playing experience</Headline4>
          <Text>{user.state.playingExperience}</Text>
        </Col>
        {user.coach && (
          <Col>
            <Headline4>Teaching experience</Headline4>
            <Text>{user.state.teachingExperience}</Text>
            <Headline4>Teaching methodology</Headline4>
            <Text>{user.state.teachingMethodology}</Text>
          </Col>
        )}
      </Row>
    </Layout>
  );
};
