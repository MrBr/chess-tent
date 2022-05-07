import React, { FunctionComponent } from 'react';
import { components, ui } from '@application';
import { User } from '@chess-tent/models';
import styled from '@emotion/styled';

const { Text, Row, Col } = ui;
const { UserAvatar } = components;

interface ConversationRowProps {
  participant: User;
  setParticipant: (user: User) => void;
  read: boolean;
  lastMessage?: string;
  className?: string;
}

const ConversationRow = styled<FunctionComponent<ConversationRowProps>>(
  ({ participant, setParticipant, read, lastMessage, className }) => (
    <Row
      onClick={() => setParticipant(participant)}
      key={participant.id}
      className={`g-0 ${className}`}
    >
      <Col className="col-auto d-flex align-items-center pr-0">
        <UserAvatar user={participant} />
      </Col>
      <Col className="text-truncate">
        <Text
          weight={700}
          className="m-0 text-truncate"
          fontSize="small"
          color="title"
        >
          {participant.name}
        </Text>
        <Text
          className="m-0 text-truncate"
          fontSize="small"
          color="title"
          weight={read ? 400 : 700}
        >
          {lastMessage}
        </Text>
      </Col>
    </Row>
  ),
)({
  ':hover': {
    background: '#e7e7e7',
  },
  cursor: 'pointer',
  padding: '0.75em 1.5em',
});

export default ConversationRow;
