import { records, state } from '@application';
import { Activity, applyUpdates, TYPE_ACTIVITY } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';

const activity = records.createRecord(
  records.withRecordBase<Activity>(),
  records.withRecordDenormalized(TYPE_ACTIVITY),
  records.withRecordMethod(
    'applyPatch',
    store => record => (modifier: (draft: RecordValue<Activity>) => void) => {
      const action = state.actions.serviceAction(
        applyUpdates(record.get().value)(modifier),
      )();
      store.dispatch(action);
    },
  ),
);

export { activity };
