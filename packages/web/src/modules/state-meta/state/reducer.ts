import {
  DELETE_META_STATE,
  DeleteMetaStateAction,
  UPDATE_META_STATE,
  UpdateMetaStateAction,
} from './actions';

const reducer = (
  state: { [key: string]: any } = {},
  action: UpdateMetaStateAction | DeleteMetaStateAction,
) => {
  switch (action.type) {
    case UPDATE_META_STATE: {
      return {
        ...state,
        [action.meta.key]: action.payload,
      };
    }
    case DELETE_META_STATE: {
      const newState = { ...state };
      delete newState[action.meta.key];
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
