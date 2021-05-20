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
      const previousValue = state[action.meta.key].value;
      const payloadValue = action.payload.value;
      const test = () => {
        const entityValue = formatEntityValue(payloadValue);
        if (
          Array.isArray(previousValue) &&
          !Array.isArray(entityValue) &&
          typeof entityValue === 'string'
        ) {
          return [...previousValue, entityValue];
        }
        return entityValue;
      };
      return {
        ...state,
        [action.meta.key]: {
          value: test(),
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
