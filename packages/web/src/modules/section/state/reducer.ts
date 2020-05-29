import { isSection, isStep, SectionChild } from '@chess-tent/models';
import {
  UPDATE_ENTITIES,
  ADD_SECTION_CHILD,
  REMOVE_SECTION_CHILD,
  SectionAction,
  SectionsState,
} from '@types';

const transformToNormalizrShape = (item: Partial<SectionChild>) => ({
  id: item.id,
  schema: item.type,
});

const transformFromNormalizrShape = (item: { id: string; schema: string }) => ({
  id: item.id,
  type: item.schema,
});

export const reducer = (state: SectionsState = {}, action: SectionAction) => {
  switch (action.type) {
    case ADD_SECTION_CHILD: {
      const sectionId = action.meta.id;
      const section = state[sectionId];
      return {
        ...state,
        [sectionId]: {
          ...section,
          children: [
            ...section.children,
            transformToNormalizrShape(action.payload),
          ],
        },
      };
    }
    case REMOVE_SECTION_CHILD: {
      const sectionId = action.meta.id;
      const child = action.payload;
      const section = state[sectionId];
      const childIndex = section.children
        .map(transformFromNormalizrShape)
        .findIndex(
          item =>
            ((isStep(item) && isStep(child)) ||
              (isSection(item) && isSection(child))) &&
            item.id === child.id,
        );
      // Removes all the children affected by removed child - all that are afterward
      const children = section.children.slice(0, childIndex - 1);
      return {
        ...state,
        [sectionId]: {
          ...section,
          children,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.sections
        ? {
            ...state,
            ...action.payload.sections,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
