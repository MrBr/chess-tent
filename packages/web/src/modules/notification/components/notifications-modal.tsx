import React from 'react';
import { ui, components, hooks } from '@application';
import { useLoadMoreNotifications } from '../hooks';

const { Headline3, ModalBody, Modal, Dropdown, LoadMore } = ui;
const { NotificationRender } = components;
const { useActiveUserNotifications } = hooks;

export default ({ close }: { close: () => void }) => {
  const [notifications] = useActiveUserNotifications();
  const [loadMoreNotifications, loading, noMore] = useLoadMoreNotifications();

  return (
    <Modal show scrolalble close={close}>
      <ModalBody>
        <Headline3 className="mt-0">Notifications</Headline3>
        {notifications?.map(notification => (
          <div key={notification.id} onClick={close}>
            <NotificationRender
              view="DropdownItem"
              notification={notification}
            />
            <Dropdown.Divider />
          </div>
        ))}
        <LoadMore
          loadMore={loadMoreNotifications}
          loading={loading}
          noMore={noMore}
        />
      </ModalBody>
    </Modal>
  );
};
