import React from 'react';
import { ui, hooks } from '@application';

import Conversations from './conversations';

const { Icon, Offcanvas } = ui;
const { usePromptOffcanvas } = hooks;

const ConversationsStand = () => {
  const promptOffcanvas = usePromptOffcanvas();
  return (
    <Icon
      type="notification"
      onClick={() =>
        promptOffcanvas(close => (
          <Offcanvas show onHide={close}>
            <Offcanvas.Header closeButton>Messages</Offcanvas.Header>
            <Conversations />
          </Offcanvas>
        ))
      }
    />
  );
};

export default ConversationsStand;
