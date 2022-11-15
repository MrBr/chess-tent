import React from 'react';
import { components, ui } from '@application';
import { User, Message as MessageModel } from '@chess-tent/models';
import { DateTime } from 'luxon';

import Message from './message';

interface ConversationMessageProps {
  message: string;
  timestamp: number;
  activeUser: User;
  messageOwner: User;
  prevMessage?: MessageModel;
}

const { Container, Text } = ui;
const { UserAvatar } = components;

const todayTime = DateTime.fromMillis(Date.now());

// Component is memoized
const ConversationMessage = ({
  message,
  activeUser,
  messageOwner,
  prevMessage,
  timestamp,
}: ConversationMessageProps) => {
  const nowMillis = Date.now();
  const messageTime = DateTime.fromMillis(timestamp);
  const prevMessageTime = DateTime.fromMillis(
    prevMessage?.timestamp || nowMillis,
  );
  const messageTimeDiff = messageTime.diff(prevMessageTime, ['minutes']);

  const showAuthor = prevMessage?.owner !== messageOwner?.id;
  const showDate = messageTime.startOf('day') < todayTime.startOf('day');
  const showTime = showAuthor || messageTimeDiff.minutes > 5;

  const author = showAuthor && messageOwner && (
    <UserAvatar size="small" user={messageOwner} />
  );
  const dateTime = showTime && (
    <Text inline fontSize="smallest" weight={700} className="ms-3">
      {showDate &&
        DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATE_MED)}{' '}
      {DateTime.fromMillis(timestamp).toLocaleString(DateTime.TIME_24_SIMPLE)}
    </Text>
  );

  if (messageOwner.id === activeUser.id) {
    return (
      <>
        <div className="text-end">{dateTime}</div>
        <Message owner>{message}</Message>
      </>
    );
  }

  return (
    <Container className="pl-0">
      {author}
      {dateTime}
      <Message className="pl-4 mt-1">{message}</Message>
    </Container>
  );
};

// There's no need to re-render message for now.
// Maybe in future to show read status change.
export default React.memo(ConversationMessage, () => true);
