import React, { useMemo } from 'react';
import { components, hooks, ui } from '@application';
import { groupBy } from 'lodash';
import MentorshipCard from '../components/card';

const { useActiveUserRecord, useStudents, useOpenConversations } = hooks;
const { Container, Row, Headline6, Headline5, Button } = ui;
const { MentorshipAction, Page } = components;

const Students = () => {
  const { value: user } = useActiveUserRecord();
  const { value: students } = useStudents(user);
  const [conversationCanvas, openConversations] = useOpenConversations();
  const result = useMemo(
    () => groupBy(students, student => student.approved),
    [students],
  );

  return (
    <Page>
      {conversationCanvas}
      <Container fluid className="px-5 py-4">
        <Headline5 className="t">My students</Headline5>
        <Headline6 className="my-3">Pending approval</Headline6>
        <Row>
          {result['undefined']?.map(mentorship => (
            <MentorshipCard
              key={mentorship.student.id}
              user={mentorship.student}
            >
              <Row className="g-0">
                <Button
                  onClick={() => openConversations(mentorship.student)}
                  className="me-4"
                  size="extra-small"
                  variant="regular"
                >
                  Message
                </Button>
                <MentorshipAction
                  mentorship={mentorship}
                  text="Accept"
                  className="me-4"
                />
                <MentorshipAction
                  mentorship={mentorship}
                  approve={false}
                  text="Decline"
                />
              </Row>
            </MentorshipCard>
          ))}
        </Row>
        <Headline6 className="my-3">Active</Headline6>
        <Row>
          {result['true']?.map(mentorship => (
            <MentorshipCard
              key={mentorship.student.id}
              user={mentorship.student}
            />
          ))}
        </Row>
        <Headline6 className="my-3">Declined</Headline6>
        <Row>
          {result['false']?.map(mentorship => (
            <MentorshipCard
              key={mentorship.student.id}
              user={mentorship.student}
            />
          ))}
        </Row>
      </Container>
    </Page>
  );
};

export default Students;
