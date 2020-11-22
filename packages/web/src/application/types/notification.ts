import { Notification } from '@chess-tent/models';
import { NotificationComponent } from './components';

export type NotificationView = 'Toast' | 'DropdownItem' | 'ListItem';

export type NotificationRenderer<T extends Notification> = Partial<
  Record<NotificationView, NotificationComponent<T> | undefined>
>;
