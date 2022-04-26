import React, { useMemo } from 'react';
import reverse from 'lodash/reverse';
import { components, hooks, ui, requests, state } from '@application';
import { css } from '@chess-tent/styled-props';

const { Icon, Dropdown, Absolute, Dot } = ui;
const { NotificationRender, NotificationsModal } = components;
const { useActiveUserNotifications, useApi, useDispatch, usePrompt } = hooks;

const { actions } = state;

const NOTIFICATIONS_LIMIT = 5;

const { className: menuClassName } = css`
  width: 250px;
`;

const Stand = () => {
  const { value: notifications } =
    useActiveUserNotifications(NOTIFICATIONS_LIMIT);
  const { fetch: updateNotifications } = useApi(requests.updateNotifications);
  const dispatch = useDispatch();
  const [modal, promptModal] = usePrompt(close => (
    <NotificationsModal close={close} />
  ));

  const handleUnseenNotifications = () => {
    const unseenNotifications = notifications?.filter(
      notification => !notification.seen,
    );

    if (!!unseenNotifications?.length) {
      const updatedNotifications = unseenNotifications.map(notification => ({
        ...notification,
        seen: true,
      }));
      dispatch(actions.updateEntities(updatedNotifications));
      updateNotifications({
        ids: unseenNotifications.map(notification => notification.id),
        updates: { seen: true },
      });
    }
  };

  const unseen = notifications?.some(notification => !notification.seen);
  const reversedNotifications = useMemo(
    () => (notifications ? reverse([...notifications]) : null),
    [notifications],
  );

  return (
    <>
      {modal}
      <Dropdown className="me-3" onClick={handleUnseenNotifications}>
        <Dropdown.Toggle id="notification-stand" collapse>
          {unseen && (
            <Absolute top={4} right={3}>
              <Dot />
            </Absolute>
          )}
          <Icon type="notifications" />
        </Dropdown.Toggle>
        <Dropdown.Menu className={menuClassName}>
          {!!reversedNotifications &&
            reversedNotifications?.map(notification => (
              <React.Fragment key={notification.id}>
                <NotificationRender
                  view="DropdownItem"
                  notification={notification}
                />
                <Dropdown.Divider />
              </React.Fragment>
            ))}
          {!!notifications && (
            <Dropdown.Item onClick={promptModal}>See all</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default Stand;
