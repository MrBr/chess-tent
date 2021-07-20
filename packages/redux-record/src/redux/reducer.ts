import { Reducer } from 'redux';
import {
  DELETE_RECORD,
  RecordAction,
  RecordState,
  UPDATE_RECORD,
  PUSH_RECORD,
} from '../../types';

export const records: Reducer<RecordState, RecordAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case UPDATE_RECORD: {
      return {
        ...state,
        [action.meta.key]: {
          value: action.payload.value,
          meta: {
            ...state[action.meta.key]?.meta,
            ...action.payload.meta,
          },
        },
      };
    }
    case PUSH_RECORD: {
      const previousValue = (state[action.meta.key]?.value as []) || [];
      const payloadValue = action.payload.value;
      return {
        ...state,
        [action.meta.key]: {
          value: [...previousValue, payloadValue],
          meta: {
            ...state[action.meta.key]?.meta,
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
