import React from 'react';
import { ui } from '@application';

import useOpenConversations from '../hooks/useOpenConversations';

const { Icon } = ui;

const ConversationsStand = () => {
  const openConversations = useOpenConversations();
  return <Icon type="notification" onClick={() => openConversations()} />;
};

export default ConversationsStand;
