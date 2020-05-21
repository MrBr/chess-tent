import { Section, Step } from '@chess-tent/models';
import { Action, UpdateEntitiesAction } from '../../state';

export const ADD_SECTION_CHILD = 'ADD_SECTION_CHILD';
export const REMOVE_SECTION_CHILD = 'REMOVE_SECTION_CHILD';

/**
 * Section actions
 */
type AddSectionChildAction = Action<
  typeof ADD_SECTION_CHILD,
  | { id: Section['id']; schema: Section['schema'] }
  | { id: Step['id']; schema: Step['schema'] },
  { id: Section['id'] }
>;
type RemoveSectionChildAction = Action<
  typeof REMOVE_SECTION_CHILD,
  | { id: Section['id']; schema: Section['schema'] }
  | { id: Step['id']; schema: Step['schema'] },
  { id: Section['id'] }
>;

export type SectionAction =
  | UpdateEntitiesAction
  | AddSectionChildAction
  | RemoveSectionChildAction;

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
