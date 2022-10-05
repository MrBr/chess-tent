import { records, requests } from '@application';
import { TYPE_NOTIFICATION } from '@chess-tent/models';
import { ActiveUserNotificationsRecord } from '@types';

const activeUserNotifications =
  records.createRecord<ActiveUserNotificationsRecord>({
    ...records.collectionRecipe,
    ...records.createApiRecipe(requests.notifications),
    ...records.createDenormalizedCollectionRecipe(TYPE_NOTIFICATION),
  });

export { activeUserNotifications };
