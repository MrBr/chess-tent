import { Middleware } from '@types';
import application from '@application';
import {
  PUSH_RECORD,
  CONCAT_RECORD,
  INIT_RECORD,
  UPDATE_RECORD,
} from '@chess-tent/redux-record/dist/types';
import { selectRecord } from '@chess-tent/redux-record';
import { formatEntityValue } from '../_helpers';

export const middleware: Middleware = store => next => action => {
  if (
    action.type === PUSH_RECORD ||
    action.type === UPDATE_RECORD ||
    action.type === CONCAT_RECORD ||
    action.type === INIT_RECORD
  ) {
    const { value } = action.payload;

    // meta.normalized is an escape hatch, to save normalized data directly to record value
    const { key, normalized } = action.meta;
    const shouldNormalize = selectRecord(key)(store.getState())?.meta
      ?.normalized;
    if (
      shouldNormalize &&
      ((Array.isArray(value) && typeof value?.[0] === 'object') ||
        (!Array.isArray(value) && typeof value === 'object'))
    ) {
      store.dispatch(application.state.actions.updateEntities(value));
      action.payload.value = formatEntityValue(value);
      return next(action);
    }
  }
  return next(action);
};
