import { UPDATE_ENTITIES, TagState, UpdateEntitiesAction } from '@types';

export const reducer = (state: TagState = {}, action: UpdateEntitiesAction) => {
  switch (action.type) {
    case UPDATE_ENTITIES: {
      return action.payload.tags
        ? {
            ...state,
            ...action.payload.tags,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
