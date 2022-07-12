import React, { ComponentType } from 'react';
import { components, hooks, ui } from '@application';

import HeaderContainer from './container';

const { Col, Button } = ui;
const { NotificationStand, Invitation, ConversationsStand, Search } =
  components;
const { useHistory } = hooks;

// Default dashboard header
const HeaderDashboard: ComponentType = () => {
  const history = useHistory();

  return (
    <HeaderContainer>
      <Col>
        <Search />
      </Col>
      <Col className="d-flex align-items-center justify-content-end">
        <ConversationsStand />
        <NotificationStand />
        <Invitation />
        <Button
          onClick={() => history.push('/lesson/new')}
          size="small"
          variant="secondary"
          className="ps-3 pe-3"
        >
          New template
        </Button>
      </Col>
    </HeaderContainer>
  );
};

export default HeaderDashboard;
