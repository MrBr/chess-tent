import React from 'react';
import styled from '@emotion/styled';
import { hooks, ui } from '@application';
import { Components } from '@types';
import defaultAvatarSrc from '../images/default-avatar.svg';

const { Card, CardBody, FramedProfile, Headline4, Button, Text } = ui;

const { useConversationParticipant, useHistory } = hooks;

const CoachFrame = styled(Card)({
  margin: '0.5rem',
  width: 300,
  display: 'inline-block',
  borderRadius: 16,
  background: 'linear-gradient(90deg, #F46F24 0%, #F44D24 100%)',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});

const CoachCard: Components['CoachCard'] = ({ coach }) => {
  const [, setConversationParticipant] = useConversationParticipant();
  const history = useHistory();

  return (
    <CoachFrame>
      <FramedProfile src={coach.state.imageUrl || defaultAvatarSrc} />
      <CardBody>
        <Headline4
          className="mt-1 cursor-pointer"
          onClick={() => history.push(`/user/${coach.id}`)}
        >
          {coach.name}
        </Headline4>
        <Text>Some cool phrase</Text>
        <Text fontSize="small">Up to ELO</Text>
        <Button size="small" onClick={() => setConversationParticipant(coach)}>
          Message
        </Button>
      </CardBody>
    </CoachFrame>
  );
};

export default CoachCard;
