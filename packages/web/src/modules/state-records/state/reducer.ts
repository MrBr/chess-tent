import {
  DELETE_RECORD,
  RecordAction,
  RecordState,
  UPDATE_RECORD,
  PUSH_RECORD,
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
    case PUSH_RECORD: {
      const previousValue = (state[action.meta.key].value as []) || [];
      const payloadValue = action.payload.value;
      const pushedValue = formatEntityValue(payloadValue) as string;
      return {
        ...state,
        [action.meta.key]: {
          value: [...previousValue, pushedValue],
          meta: {
            ...state[action.meta.key]?.meta,
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
