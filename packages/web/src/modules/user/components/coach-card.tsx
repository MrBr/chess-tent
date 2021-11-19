import React from 'react';
import styled from '@emotion/styled';
import { hooks, ui } from '@application';
import { Components } from '@types';
import defaultAvatarSrc from '../images/default-avatar.svg';

const { Card, CardBody, FramedProfile, Headline4, Button, Text, Row, Col } = ui;

const { useHistory, useConversationParticipant } = hooks;

const CoachFrame = styled(Card)({
  margin: '0.5rem',
  maxWidth: 300,
  height: 350,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 16,
  background: 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

const CoachCard: Components['CoachCard'] = ({ coach }) => {
  const { update: setConversationParticipant } = useConversationParticipant();
  const history = useHistory();

  return (
    <CoachFrame key={coach.id}>
      <FramedProfile src={coach.state.imageUrl || defaultAvatarSrc} />
      <CardBody>
        <Row className="flex-column flex-nowrap h-100" noGutters>
          <Col>
            <Headline4
              className="mt-1 mb-0 cursor-pointer"
              onClick={() => history.push(`/user/${coach.id}`)}
              color="alt-title"
            >
              {coach.name}
            </Headline4>
            <Text
              color="alt-subtitle"
              fontSize="small"
              className="text-truncate"
              weight={700}
            >
              {coach.state.punchline}
            </Text>
            <Text
              fontSize="extra-small"
              color="alt"
              className="text-truncate"
              weight={500}
            >
              {coach.state.studentElo && `Up to ${coach.state.studentElo} elo`}
            </Text>
          </Col>
          <Col className="col-auto">
            <Button
              size="small"
              onClick={() => setConversationParticipant(coach)}
            >
              Message1
            </Button>
          </Col>
        </Row>
      </CardBody>
    </CoachFrame>
  );
};

export default CoachCard;
