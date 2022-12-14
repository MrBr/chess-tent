import { Reducer } from 'redux';
import {
  DELETE_RECORD,
  RecordAction,
  RecordState,
  UPDATE_RECORD,
  PUSH_RECORD,
  UPDATE_RECORD_META,
  CONCAT_RECORD,
  INIT_RECORD,
  REMOVE_RECORD,
} from '../../types';

export const records: Reducer<RecordState, RecordAction> = (
  state = {},
  action,
) => {
  switch (action.type) {
    case INIT_RECORD:
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
    case UPDATE_RECORD_META: {
      return {
        ...state,
        [action.meta.key]: {
          ...state[action.meta.key],
          meta: {
            ...state[action.meta.key]?.meta,
            ...action.payload,
          },
        },
      };
    }
    case PUSH_RECORD: {
      const previousValue = (state[action.meta.key]?.value as []) || [];
      const { value, meta } = action.payload;
      return {
        ...state,
        [action.meta.key]: {
          value: [...previousValue, value],
          meta: {
            ...state[action.meta.key]?.meta,
            ...meta,
          },
        },
      };
    }
    case REMOVE_RECORD: {
      const { value, meta } = action.payload;
      const previousValue = state[action.meta.key]?.value;
      const newValue = Array.isArray(state[action.meta.key]?.value)
        ? previousValue.filter((item: unknown) => item !== value)
        : undefined;
      return {
        ...state,
        [action.meta.key]: {
          value: newValue,
          meta: {
            ...state[action.meta.key]?.meta,
            ...meta,
          },
        },
      };
    }
    case CONCAT_RECORD: {
      const previousValue = (state[action.meta.key]?.value as []) || [];
      const payloadValue = action.payload.value || [];
      const meta = action.payload.meta;
      return {
        ...state,
        [action.meta.key]: {
          value: [...previousValue, ...payloadValue],
          meta: {
            ...state[action.meta.key]?.meta,
            ...meta,
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
