import {
  DELETE_RECORD,
  RecordAction,
  RecordState,
  UPDATE_RECORD,
} from '@types';
import { formatEntityValue, getEntityType } from './_helpers';

export const records = (state: RecordState = {}, action: RecordAction) => {
  switch (action.type) {
    case UPDATE_RECORD: {
      return {
        ...state,
        [action.meta.key]: {
          value: formatEntityValue(action.payload.value),
          meta: {
            ...state[action.meta.key]?.meta,
            ...action.payload.meta,
            type: getEntityType(action.payload.value),
          },
        },
      };
    }
    case DELETE_RECORD: {
      const newState = { ...state };
      delete newState[action.meta.key];
      return newState;
    }
    default:
      return state;
  }
};
