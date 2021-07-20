import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';
import { conversationParticipant } from '../records';

const { Button } = ui;
const { useRecordInit } = hooks;

const MessageButton: Components['MessageButton'] = ({
  variant,
  text,
  size,
  user,
  className,
}) => {
  const { update: setConversationParticipant } = useRecordInit(
    conversationParticipant,
  );

  return (
    <Button
      className={className}
      size={size}
      onClick={() => setConversationParticipant(user)}
      variant={variant}
    >
      {text}
    </Button>
  );
};

MessageButton.defaultProps = {
  size: 'small',
  text: 'Message',
};

export default MessageButton;
