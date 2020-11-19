import { UPDATE_ENTITIES, MentorshipState, UpdateEntitiesAction } from '@types';

export const reducer = (
  state: MentorshipState = {},
  action: UpdateEntitiesAction,
) => {
  switch (action.type) {
    case UPDATE_ENTITIES: {
      return action.payload.mentorship
        ? {
            ...state,
            ...action.payload.mentorship,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
