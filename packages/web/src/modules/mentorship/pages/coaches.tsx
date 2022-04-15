import React from 'react';
import { components, hooks, ui } from '@application';

const { useActiveUserRecord, useCoaches, useOpenConversations } = hooks;
const { Container, Row, Col, Text, Headline2, Card, CardBody, Button } = ui;
const { MentorshipAction, Page, UserAvatar } = components;

const Coaches = () => {
  const { value: user } = useActiveUserRecord();
  const { value: coaches } = useCoaches(user);
  const openConversations = useOpenConversations();
  return (
    <Page>
      <Headline2>My coaches</Headline2>
      <Container>
        <Row>
          {coaches?.map(mentorship => (
            <Card>
              <CardBody>
                <Row className="g-0 mb-3">
                  <Col className="col-auto me-3">
                    <UserAvatar user={mentorship.coach} />
                  </Col>
                  <Col>
                    <Text>{mentorship.coach.name}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      onClick={() => openConversations(mentorship.coach)}
                      size="extra-small"
                      className="me-3"
                    >
                      Message
                    </Button>
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
