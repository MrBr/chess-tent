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
      className={`g-0 ${className} border-bottom align-items-center`}
    >
      <Col className="col-auto d-flex align-items-center pr-0 me-3">
        <UserAvatar user={participant} />
      </Col>
      <Col className="text-truncate">
        <Text weight={500} className="m-0 text-truncate" fontSize="small">
          {participant.name}
        </Text>
        <Text
          className="m-0 text-truncate"
          fontSize="extra-small"
          weight={read ? 300 : 700}
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
