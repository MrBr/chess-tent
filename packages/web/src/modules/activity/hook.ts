import { useEffect } from 'react';
import { hooks, records, socket } from '@application';
import { Hooks, Records } from '@types';
import { Activity, TYPE_ACTIVITY } from '@chess-tent/models';
import { InferInitRecord } from '@chess-tent/redux-record/types';

export const useActivity: Hooks['useActivity'] = <T extends Activity>(
  activityId: string,
) => {
  const record = hooks.useRecordInit<InferInitRecord<Records<T>['activity']>>(
    records.activity,
    `${TYPE_ACTIVITY}-${activityId}`,
  );

  useEffect(() => {
    socket.subscribe(record.recordKey);

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      socket.unsubscribe(record.recordKey);
    };
  }, [record.recordKey]);

  return record;
};
