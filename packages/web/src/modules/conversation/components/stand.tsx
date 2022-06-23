import React from 'react';
import { ui } from '@application';

import useOpenConversations from '../hooks/useOpenConversations';
import { useConversations } from '../hooks/useConversations';

const { Icon, Dot, Absolute } = ui;

const ConversationsStand = () => {
  const [conversationCanvas, openConversations] = useOpenConversations();
  const [, , haveUnreadMessages] = useConversations();
  return (
    <>
      {conversationCanvas}
      <div className="d-inline-block me-3 position-relative">
        <Icon type="conversation" onClick={() => openConversations()} />
        {haveUnreadMessages && (
          <Absolute right={10} top={-5} onClick={() => openConversations()}>
            <Dot />
          </Absolute>
        )}
      </div>
    </>
  );
};

export default ConversationsStand;
