import React from 'react';
import { components, hooks, ui, requests, state } from '@application';

const { Icon, Dropdown, Absolute, Dot } = ui;
const { NotificationRender, NotificationsModal } = components;
const {
  useActiveUserNotifications,
  useApi,
  useDispatch,
  usePromptModal,
} = hooks;

const { actions } = state;

const NOTIFICATIONS_LIMIT = 5;

export default () => {
  const [notifications] = useActiveUserNotifications(NOTIFICATIONS_LIMIT);
  const { fetch: updateNotifications } = useApi(requests.updateNotifications);
  const dispatch = useDispatch();
  const promptModal = usePromptModal();

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
  return (
    <Dropdown className="mr-4" onClick={handleUnseenNotifications}>
      <Dropdown.Toggle id="notification-stand" collapse>
        {unseen && (
          <Absolute top={4} right={3}>
            <Dot />
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
        {!!notifications && (
          <Dropdown.Item
            onClick={() =>
              promptModal(close => <NotificationsModal close={close} />)
            }
          >
            See all
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
