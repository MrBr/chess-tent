import { records } from '@application';
import { TYPE_ACTIVITY } from '@chess-tent/models';
import { Records } from '@types';

const getRecordInitByNamespace: Records['getRecordInitByNamespace'] = (
  namespace: typeof TYPE_ACTIVITY,
) => {
  if (namespace !== TYPE_ACTIVITY) {
    throw new Error(`Unknown namespace ${namespace}`);
  }
  return records.activity;
};

export { getRecordInitByNamespace };
