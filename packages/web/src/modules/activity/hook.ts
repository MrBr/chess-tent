import { hooks, records } from '@application';
import { Hooks, Records } from '@types';
import { Activity, TYPE_ACTIVITY } from '@chess-tent/models';
import { RecordHookReturn } from '@chess-tent/redux-record/types';

const { useSocketSubscribe, useRecordInit } = hooks;

export const useActivity: Hooks['useActivity'] = <T extends Activity>(
  activityId: string,
): RecordHookReturn<Records<T>['activity']> => {
  const recordKey = `${TYPE_ACTIVITY}-${activityId}`;

  const record = useRecordInit(
    records.activity as Records<T>['activity'],
    recordKey,
  );

  useSocketSubscribe(recordKey);

  return record;
};
