import React from 'react';
import { components, hooks, ui } from '@application';
import { User } from '@chess-tent/models';
import styled from '@chess-tent/styled-props';
import ConversationMessages from './conversation-messages';
import { useConversation } from '../hooks/useConversation';

const { Headline5, Row, Col, Icon, Offcanvas, Spinner } = ui;
const { UserAvatar, MentorshipButton } = components;
const { useHistory } = hooks;

interface ConversationProps {
  className?: string;
  activeUser: User;
  participant: User;
  close: () => void;
}

export default styled<ConversationProps>(
  ({ activeUser, participant, close }) => {
    const history = useHistory();
    const conversation = useConversation(participant);

    return (
      <>
        <Offcanvas.Header closeButton={false} className="flex-column">
          <Row className="g-0 align-items-center w-100">
            <Col className="col-auto me-1">
              <Icon type="left" size="extra-small" onClick={close} />
            </Col>
            <Col className="col-auto me-1">
              <UserAvatar user={participant} size="small" />
            </Col>
            <Col
              onClick={() => history.push(`/user/${participant.id}`)}
              className="cursor-pointer"
            >
              <Headline5 className="m-0">{participant.name}</Headline5>
            </Col>
          </Row>
          <Row className="w-100">
            <Col>
              <MentorshipButton user={participant} className="mt-4" />
            </Col>
          </Row>
        </Offcanvas.Header>
        {conversation ? (
          <ConversationMessages
            activeUser={activeUser}
            conversation={conversation}
          />
        ) : (
          <Spinner animation="border" />
        )}
      </>
    );
  },
).css`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  max-height: 100%;
  width: 100%;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 10px 20px rgba(24, 34, 53, 0.1);
  border-right: 1px solid #E8E9EB;
`;
