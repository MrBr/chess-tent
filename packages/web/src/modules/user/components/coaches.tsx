import React, { useEffect } from 'react';
import { requests, hooks, ui } from '@application';
import styled from '@emotion/styled';

const {
  useApi,
  useComponentStateSilent,
  useConversationParticipant,
  useHistory,
} = hooks;
const {
  Card,
  Container,
  Row,
  Col,
  FramedProfile,
  Text,
  Headline4,
  Button,
  CardBody,
} = ui;

const CoachCard = styled(Card)({
  width: 300,
  display: 'inline-block',
  borderRadius: 16,
  background: 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

export default () => {
  const { mounted } = useComponentStateSilent();
  const history = useHistory();
  const [, setConversationParticipant] = useConversationParticipant();
  const { fetch: fetchCoaches, response } = useApi(requests.users);

  useEffect(() => {
    !mounted && fetchCoaches({ coach: true });
  }, [mounted, fetchCoaches]);

  return (
    <Container fluid>
      <Row>
        {response?.data.map(coach => (
          <Col key={coach.id} className="col-auto">
            <CoachCard>
              <FramedProfile src={coach.state.imageUrl} />
              <CardBody>
                <Headline4
                  className="mt-1 cursor-pointer"
                  onClick={() => history.push(`/user/${coach.id}`)}
                >
                  {coach.name}
                </Headline4>
                <Text>Some cool phrase</Text>
                <Text fontSize="small">Up to ELO</Text>
                <Button
                  size="small"
                  onClick={() => setConversationParticipant(coach)}
                >
                  Message
                </Button>
              </CardBody>
            </CoachCard>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
