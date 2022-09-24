import React from 'react';
import { components, hooks, ui } from '@application';
import MentorshipCard from '../components/card';

const { useCoaches, useOpenConversations } = hooks;
const { Row, Col, Headline5, Button } = ui;
const { MentorshipAction, Page } = components;

const Coaches = () => {
  const { value: coaches } = useCoaches();
  const [conversationCanvas, openConversations] = useOpenConversations();
  return (
    <Page>
      {conversationCanvas}
      <Page.Body>
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
      </Page.Body>
    </Page>
  );
};

export default Coaches;
