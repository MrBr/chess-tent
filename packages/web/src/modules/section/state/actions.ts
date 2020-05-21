import { Section, Step } from '@chess-tent/models';
import {
  ADD_SECTION_CHILD,
  AddSectionChildAction,
  REMOVE_SECTION_CHILD,
  RemoveSectionChildAction,
} from '@types';

export const addSectionChildAction = (
  section: Section,
  childSection: Section | Step,
): AddSectionChildAction => ({
  type: ADD_SECTION_CHILD,
  payload: {
    id: childSection.id,
    schema: childSection.schema,
  },
  meta: {
    id: section.id,
  },
});
export const removeSectionChildAction = (
  section: Section,
  child: Section | Step,
): RemoveSectionChildAction => ({
  type: REMOVE_SECTION_CHILD,
  payload: {
    id: child.id,
    schema: child.schema,
  },
  meta: {
    id: section.id,
  },
});
