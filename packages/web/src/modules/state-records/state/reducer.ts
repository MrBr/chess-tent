import {
  DELETE_RECORD,
  RecordAction,
  RecordState,
  UPDATE_RECORD,
  UPDATE_RECORD_VALUE,
} from '@types';
import { formatEntityValue } from './_helpers';

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
          },
        },
      };
    }
    case UPDATE_RECORD_VALUE: {
      return {
        ...state,
        [action.meta.key]: {
          value: action.payload,
          meta: {
            ...state[action.meta.key]?.meta,
            type: action.meta.type,
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
