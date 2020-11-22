import React from 'react';
import { components, hooks, ui } from '@application';
import styled from '@emotion/styled';

const { Icon, Dropdown, Absolute } = ui;
const { NotificationRender } = components;
const { useActiveUserNotifications } = hooks;
const UnreadMark = styled.span({
  borderRadius: '50%',
  background: 'red',
  display: 'inline-block',
  width: 7,
  height: 7,
});
export default () => {
  const [notifications] = useActiveUserNotifications();
  const unread = notifications?.some(notification => !notification.read);
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
      <Dropdown.Menu width={250}>
        {!!notifications ? (
          notifications?.map(notification => (
            <React.Fragment key={notification.id}>
              <NotificationRender
                view="DropdownItem"
                notification={notification}
              />
              <Dropdown.Divider />
            </React.Fragment>
          ))
        ) : (
          <React.Fragment key="all-read">
            <Dropdown.Item>All read</Dropdown.Item>
            <Dropdown.Divider />
          </React.Fragment>
        )}
        <Dropdown.Item>See all</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
