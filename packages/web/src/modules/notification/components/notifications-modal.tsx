import React, { useMemo } from 'react';
import reverse from 'lodash/reverse';
import { ui, components, hooks } from '@application';
import { useLoadMoreNotifications } from '../hooks';

const { Headline3, ModalBody, Modal, Dropdown, LoadMore } = ui;
const { NotificationRender } = components;
const { useActiveUserNotifications } = hooks;

const NotificationModal = ({ close }: { close: () => void }) => {
  const { value: notifications } = useActiveUserNotifications();
  const [loadMoreNotifications, loading, noMore] = useLoadMoreNotifications();

  const reversedNotifications = useMemo(
    () => (notifications ? reverse([...notifications]) : null),
    [notifications],
  );

  return (
    <Modal show scrollable close={close}>
      <ModalBody>
        <Headline3 className="mt-0">Notifications</Headline3>
        {reversedNotifications?.map(notification => (
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

export default NotificationModal;
