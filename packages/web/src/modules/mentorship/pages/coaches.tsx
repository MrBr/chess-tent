import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';

const { useActiveUserRecord, useCoaches } = hooks;
const { Container, Row, Col, Text, Headline2, Card, CardBody } = ui;
const { MentorshipAction, Layout, MessageButton, UserAvatar } = components;

const Coaches = () => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const [coaches] = useCoaches(user);
  return (
    <Layout>
      <Headline2>My coaches</Headline2>
      <Container>
        <Row>
          {coaches?.map(mentorship => (
            <Card>
              <CardBody>
                <Row noGutters className="mb-3">
                  <Col className="col-auto mr-3">
                    <UserAvatar user={mentorship.coach} />
                  </Col>
                  <Col>
                    <Text>{mentorship.coach.name}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <MessageButton
                      user={mentorship.coach}
                      size="extra-small"
                      className="mr-3"
                    />
                    <MentorshipAction
                      mentorship={mentorship}
                      approve={false}
                      text="Revoke"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default Coaches;