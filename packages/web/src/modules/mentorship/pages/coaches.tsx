import React from 'react';
import { components, hooks, ui } from '@application';

const { useActiveUserRecord, useCoaches } = hooks;
const { Container, Row, Col, Text, Headline2, Card, CardBody } = ui;
const { MentorshipAction, Page, MessageButton, UserAvatar } = components;

const Coaches = () => {
  const [user] = useActiveUserRecord();
  const [coaches] = useCoaches(user);
  return (
    <Page>
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
    </Page>
  );
};

export default Coaches;
