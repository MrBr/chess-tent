import React from 'react';
import { components, ui } from '@application';
import { User } from '@chess-tent/models';
import { DateTime } from 'luxon';

import Message from './message';

interface ConversationMessageProps {
  message: string;
  timestamp: number;
  activeUser: User;
  messageOwner: User;
  lastMessageOwner?: User;
}

const { Container, Text } = ui;
const { UserAvatar } = components;

const ConversationMessage = ({
  message,
  activeUser,
  messageOwner,
  lastMessageOwner,
  timestamp,
}: ConversationMessageProps) => {
  if (messageOwner.id === activeUser.id) {
    return <Message owner>{message}</Message>;
  }

  return (
    <Container className="pl-0">
      {lastMessageOwner?.id !== messageOwner?.id && (
        <>
          {messageOwner && <UserAvatar size="small" user={messageOwner} />}
          <Text inline fontSize="extra-small" weight={700} className="ms-3">
            {DateTime.fromMillis(timestamp).toLocaleString(
              DateTime.TIME_24_SIMPLE,
            )}
          </Text>
        </>
      )}
      <Message className="pl-4 mt-1">{message}</Message>
    </Container>
  );
};

export default ConversationMessage;
