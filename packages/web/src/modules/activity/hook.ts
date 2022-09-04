import { useEffect } from 'react';
import { hooks, records, socket } from '@application';
import { Hooks, Records } from '@types';
import { Activity, TYPE_ACTIVITY } from '@chess-tent/models';
import { RecordHookReturn } from '@chess-tent/redux-record/types';

export const useActivity: Hooks['useActivity'] = <T extends Activity>(
  activityId: string,
): RecordHookReturn<Records<T>['activity']> => {
  const recordKey = `${TYPE_ACTIVITY}-${activityId}`;
  const record = hooks.useRecordInit(records.activity, recordKey);

  useEffect(() => {
    socket.subscribe(recordKey);

    return () => {
      // In case activity change from within activity this may not trigger
      // take care
      socket.unsubscribe(recordKey);
    };
  }, [recordKey]);

  return record;
};
