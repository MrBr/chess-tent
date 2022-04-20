import React from 'react';
import { ui } from '@application';

import useOpenConversations from '../hooks/useOpenConversations';

const { Icon } = ui;

const ConversationsStand = () => {
  const openConversations = useOpenConversations();
  return (
    <div className="d-inline-block">
      <Icon type="conversation" onClick={() => openConversations()} />
    </div>
  );
};

export default ConversationsStand;
