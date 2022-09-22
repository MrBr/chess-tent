import React, { useState } from 'react';
import { hooks, ui } from '@application';
import { User, getLatestMessage } from '@chess-tent/models';

import Conversation from './conversation';
import ConversationRow from './conversation-row';
import { useConversations } from '../hooks/useConversations';

const { Offcanvas, Headline5, Button, Row, Col, Spinner } = ui;
const { useActiveUserRecord } = hooks;

interface ConversationsProps {
  close: () => void;
  initialParticipant?: User;
}

const Conversations = ({ initialParticipant, close }: ConversationsProps) => {
  const { value: activeUser } = useActiveUserRecord();
  const [participant, setParticipant] = useState(initialParticipant);
  const [conversations, , , record] = useConversations();
  const {
    meta: { loading, allLoaded },
    loadMore,
  } = record;

  return (
    <Offcanvas show onHide={close}>
      {participant && (
        <Conversation
          activeUser={activeUser}
          close={() => setParticipant(undefined)}
          participant={participant}
        />
      )}
      {!participant && (
        <>
          <Offcanvas.Header>
            <Headline5 className="m-0">Messages</Headline5>
          </Offcanvas.Header>
          <Offcanvas.Body className="h-100 overflow-y-auto px-3 py-4 pt-0">
            {conversations?.map(conversation => {
              const participant =
                conversation.users.find(user => user.id !== activeUser.id) ||
                (conversation.users[0] as User); // User sends messages to himself
              const lastMessage = getLatestMessage(conversation);
              return (
                <ConversationRow
                  key={conversation.id}
                  participant={participant}
                  setParticipant={setParticipant}
                  read={
                    lastMessage?.read || lastMessage?.owner === activeUser.id
                  }
                  lastMessage={lastMessage?.message}
                />
              );
            })}
          </Offcanvas.Body>
          {!allLoaded && (
            <Row className="justify-content-center mb-3">
              <Col className="col-auto">
                <Button
                  size="small"
                  variant="tertiary"
                  disabled={loading}
                  onClick={loadMore}
                >
                  Load more {loading && <Spinner animation="border" />}
                </Button>
              </Col>
            </Row>
          )}
        </>
      )}
    </Offcanvas>
  );
};

export default Conversations;
