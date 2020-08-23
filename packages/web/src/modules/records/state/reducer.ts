import {
  RECORD_DELETE_ACTION,
  RECORD_UPDATE_ACTION,
  RecordAction,
  RecordState,
} from '@types';
import { formatEntityValue, getEntityType } from './_helpers';

export const records = (state: RecordState = {}, action: RecordAction) => {
  switch (action.type) {
    case RECORD_UPDATE_ACTION: {
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
    case RECORD_DELETE_ACTION: {
      const newState = { ...state };
      delete newState[action.meta.key];
      return newState;
    }
    default:
      return state;
  }
};
