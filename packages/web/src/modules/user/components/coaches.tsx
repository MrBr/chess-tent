import React, { useEffect } from 'react';
import { requests, hooks, ui } from '@application';
import styled from '@emotion/styled';

const { useApi, useComponentStateSilent, useConversationParticipant } = hooks;
const { Container, Row, Col, Img, Text, Headline4, Button } = ui;

const CoachCard = styled.div({
  width: 300,
  display: 'inline-block',
  borderRadius: 16,
  background: 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)',
});

export default () => {
  const { mounted } = useComponentStateSilent();
  const [, setConversationParticipant] = useConversationParticipant();
  const { fetch: fetchCoaches, response } = useApi(requests.users);

  useEffect(() => {
    !mounted && fetchCoaches({ coach: true });
  }, [mounted, fetchCoaches]);

  return (
    <Container>
      <Row>
        <Col>
          {response?.data.map(coach => (
            <CoachCard key={coach.id}>
              <Img src={coach.imageUrl} />
              <Headline4>{coach.name}</Headline4>
              <Text>Some cool phrase</Text>
              <Text fontSize="small">Up to ELO</Text>
              <Button
                size="small"
                onClick={() => setConversationParticipant(coach)}
              >
                Message
              </Button>
            </CoachCard>
          ))}
        </Col>
      </Row>
    </Container>
  );
};
