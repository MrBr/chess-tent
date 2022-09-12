import React, { ComponentType } from 'react';
import { components, hooks, ui } from '@application';

import HeaderContainer from './container';

const { Col, Button } = ui;
const { NotificationStand, ConversationsStand, Search } = components;
const { useHistory, useInviteUser } = hooks;

// Default dashboard header
const HeaderDashboard: ComponentType = () => {
  const history = useHistory();
  const [inviteUserOffcanvas, promptInvite] = useInviteUser();

  return (
    <HeaderContainer>
      <Col>
        <Search />
      </Col>
      <Col className="d-flex align-items-center justify-content-end col-auto">
        <ConversationsStand />
        <NotificationStand />
        <div className="h-25 me-3 d-none d-sm-inline-block">
          {inviteUserOffcanvas}
          <Button onClick={promptInvite} size="extra-small" variant="text">
            Invite
          </Button>
        </div>
        <Button
          onClick={() => history.push('/lesson/new')}
          size="small"
          variant="secondary"
          className="ps-3 pe-3 d-none d-sm-inline-block"
        >
          New template
        </Button>
      </Col>
    </HeaderContainer>
  );
};

export default HeaderDashboard;
