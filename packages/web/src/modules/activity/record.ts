import { records, state } from '@application';
import { Activity, applyUpdates, TYPE_ACTIVITY } from '@chess-tent/models';
import { ActivityRecord } from '@types';

const activity = records.createRecord<ActivityRecord<Activity>>({
  ...records.createDenormalizedRecipe(TYPE_ACTIVITY),
  applyPatch: () => store => record => modifier => {
    const action = state.actions.serviceAction(
      applyUpdates(record.get()?.value as Activity)(modifier),
    )();
    store.dispatch(action);
  },
});

export { activity };
