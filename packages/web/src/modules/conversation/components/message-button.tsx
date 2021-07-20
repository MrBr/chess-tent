import React from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

const { Button } = ui;
const { useConversationParticipant } = hooks;

const MessageButton: Components['MessageButton'] = ({
  variant,
  text,
  size,
  user,
  className,
}) => {
  const { update: setConversationParticipant } = useConversationParticipant();

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
