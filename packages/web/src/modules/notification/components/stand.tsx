import React from 'react';
import { hooks, ui } from '@application';
import { User } from '@chess-tent/models';
import styled from '@emotion/styled';
import { selectUserNotifications } from '../state/selectors';

const { Icon, Dropdown, Absolute } = ui;
const { useActiveUserRecord, useSelector } = hooks;
const UnreadMark = styled.span({
  borderRadius: '50%',
  background: 'red',
  display: 'inline-block',
  width: 7,
  height: 7,
});
export default () => {
  const [user] = useActiveUserRecord() as [User, never, never];
  const notifications = useSelector(selectUserNotifications(user.id));
  const unread = notifications.some(notification => notification.read);
  return (
    <Dropdown className="mr-4">
      <Dropdown.Toggle id="notification-stand" collapse>
        {unread && (
          <Absolute top={4} right={3}>
            <UnreadMark />
          </Absolute>
        )}
        <Icon type="notification" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {notifications.length > 0 ? (
          <></>
        ) : (
          <Dropdown.Item>All read</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
