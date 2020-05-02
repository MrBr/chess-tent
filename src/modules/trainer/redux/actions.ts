import {
  Action,
  Exercise,
  ExercisesState,
  Move,
  Section,
  SectionsState,
  Shape,
  StepInstance,
  StepsState,
} from '../../app/types';

export const SET_EXERCISE_ACTIVE_STEP = 'SET_EXERCISE_ACTIVE_STEP';
export const SET_EXERCISES = 'SET_EXERCISES';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';

export const SET_SECTIONS = 'SET_SECTIONS';
export const ADD_SECTION_STEP = 'ADD_SECTION_STEP';
export const ADD_SECTION_SECTION = 'ADD_SECTION_SECTION';
export const REMOVE_SECTION_STEP = 'REMOVE_SECTION_STEP';
export const REMOVE_SECTION_SECTION = 'REMOVE_SECTION_SECTION';

export const SET_STEPS = 'STEP_STEPS';
export const ADD_STEP_MOVE = 'ADD_STEP_MOVE';
export const ADD_STEP_SHAPE = 'ADD_STEP_SHAPE';
export const REMOVE_STEP_MOVE = 'REMOVE_STEP_MOVE';
export const REMOVE_STEP_SHAPE = 'REMOVE_STEP_SHAPE';
export const UPDATE_STEP = 'UPDATE_STEP';

/**
 * Exercise actions
 */
type SetExercisesAction = Action<
  typeof SET_EXERCISES,
  { [key: string]: Exercise }
>;
type SetExerciseActiveStepAction = Action<
  typeof SET_EXERCISE_ACTIVE_STEP,
  StepInstance['id'],
  { id: Exercise['id'] }
>;
type UpdateExerciseAction = Action<
  typeof UPDATE_EXERCISE,
  Omit<Exercise, 'section' | 'scheme' | 'id'>,
  { id: Exercise['id'] }
>;

export type ExerciseAction =
  | SetExercisesAction
  | SetExerciseActiveStepAction
  | UpdateExerciseAction;

export const setExercisesAction = (
  exercises: ExercisesState,
): SetExercisesAction => ({
  type: SET_EXERCISES,
  payload: exercises,
  meta: {},
});

export const setExerciseActiveStepAction = (
  exercise: Exercise,
  step: StepInstance,
): SetExerciseActiveStepAction => ({
  type: SET_EXERCISE_ACTIVE_STEP,
  payload: step.id,
  meta: {
    id: exercise.id,
  },
});

/**
 * Section actions
 */
type SetSectionsAction = Action<
  typeof SET_SECTIONS,
  { [key: string]: Section }
>;
type AddSectionSectionAction = Action<
  typeof ADD_SECTION_SECTION,
  Section['id'],
  { id: Section['id'] }
>;
type AddSectionStepAction = Action<
  typeof ADD_SECTION_STEP,
  StepInstance['id'],
  { id: Section['id'] }
>;
type RemoveSectionSectionAction = Action<
  typeof REMOVE_SECTION_SECTION,
  Section['id'],
  { id: Section['id'] }
>;
type RemoveSectionStepAction = Action<
  typeof REMOVE_SECTION_STEP,
  StepInstance['id'],
  { id: Section['id'] }
>;

export type SectionAction =
  | SetSectionsAction
  | AddSectionSectionAction
  | AddSectionStepAction
  | RemoveSectionSectionAction
  | RemoveSectionStepAction;

export const setSectionsAction = (
  sections: SectionsState,
): SetSectionsAction => ({
  type: SET_SECTIONS,
  payload: sections,
  meta: {},
});
export const addSectionSection = (
  section: Section,
  childSection: Section,
): AddSectionSectionAction => ({
  type: ADD_SECTION_SECTION,
  payload: childSection.id,
  meta: {
    id: section.id,
  },
});
export const addSectionStep = (
  section: Section,
  step: StepInstance,
): AddSectionStepAction => ({
  type: ADD_SECTION_STEP,
  payload: step.id,
  meta: {
    id: section.id,
  },
});
export const removeSectionSection = (
  section: Section,
  childSection: Section,
): RemoveSectionSectionAction => ({
  type: REMOVE_SECTION_SECTION,
  payload: childSection.id,
  meta: {
    id: section.id,
  },
});
export const removeSectionStep = (
  section: Section,
  step: StepInstance,
): RemoveSectionStepAction => ({
  type: REMOVE_SECTION_STEP,
  payload: step.id,
  meta: {
    id: section.id,
  },
});
/**
 * Step actions
 */
type UpdatableStepProps = Omit<{}, 'moves' | 'scheme' | 'shapes' | 'id'>;
type SetStepsAction = Action<typeof SET_STEPS, { [key: string]: StepInstance }>;
type AddStepMoveAction = Action<
  typeof ADD_STEP_MOVE,
  Move,
  { id: StepInstance['id'] }
>;
type AddStepShapeAction = Action<
  typeof ADD_STEP_SHAPE,
  Shape,
  { id: StepInstance['id'] }
>;
type RemoveStepMoveAction = Action<
  typeof REMOVE_STEP_MOVE,
  Move,
  { id: StepInstance['id'] }
>;
type RemoveStepShapeAction = Action<
  typeof REMOVE_STEP_SHAPE,
  Shape,
  { id: StepInstance['id'] }
>;
type UpdateStepAction = Action<
  typeof UPDATE_STEP,
  UpdatableStepProps,
  { id: StepInstance['id'] }
>;

export type StepAction =
  | SetStepsAction
  | AddStepMoveAction
  | AddStepShapeAction
  | RemoveStepMoveAction
  | RemoveStepShapeAction
  | UpdateStepAction;

export const setStepsAction = (steps: StepsState): SetStepsAction => ({
  type: SET_STEPS,
  payload: steps,
  meta: {},
});
export const addStepMoveAction = (
  step: StepInstance,
  move: Move,
): AddStepMoveAction => ({
  type: ADD_STEP_MOVE,
  payload: move,
  meta: {
    id: step.id,
  },
});
export const addStepShapeAction = (
  step: StepInstance,
  shape: Shape,
): AddStepShapeAction => ({
  type: ADD_STEP_SHAPE,
  payload: shape,
  meta: {
    id: step.id,
  },
});
export const removeStepMoveAction = (
  step: StepInstance,
  move: Move,
): RemoveStepMoveAction => ({
  type: REMOVE_STEP_MOVE,
  payload: move,
  meta: {
    id: step.id,
  },
});
export const removeStepShapeAction = (
  step: StepInstance,
  shape: Shape,
): RemoveStepShapeAction => ({
  type: REMOVE_STEP_SHAPE,
  payload: shape,
  meta: {
    id: step.id,
  },
});
export const updateStepAction = (
  step: StepInstance,
  patch: UpdatableStepProps,
): UpdateStepAction => ({
  type: UPDATE_STEP,
  payload: patch,
  meta: {
    id: step.id,
  },
});
