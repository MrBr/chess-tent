import React from 'react';
import { components, hooks, ui } from '@application';
import MentorshipCard from '../components/card';

const { useActiveUserRecord, useCoaches, useOpenConversations } = hooks;
const { Container, Row, Col, Headline5, Button } = ui;
const { MentorshipAction, Page } = components;

const Coaches = () => {
  const { value: user } = useActiveUserRecord();
  const { value: coaches } = useCoaches(user);
  const [conversationCanvas, openConversations] = useOpenConversations();
  return (
    <Page>
      {conversationCanvas}
      <Container fluid className="px-5 py-4">
        <Headline5 className="mb-3">My coaches</Headline5>
        <Row>
          {coaches?.map(mentorship => (
            <MentorshipCard key={mentorship.coach.id} user={mentorship.coach}>
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
            </MentorshipCard>
          ))}
        </Row>
      </Container>
    </Page>
  );
};

export default Coaches;
