import { combineReducers } from 'redux';

import {
  exerciseSchema,
  ExercisesState,
  sectionSchema,
  SectionsState,
  stepSchema,
  StepsState,
} from '../../app/types';
import { isSection, isStep } from '../service';
import {
  ADD_SECTION_CHILD,
  ExerciseAction,
  REMOVE_SECTION_CHILD,
  SectionAction,
  SET_EXERCISE_ACTIVE_STEP,
  StepAction,
  UPDATE_ENTITIES,
  UPDATE_EXERCISE,
  UPDATE_STEP,
  UPDATE_STEP_STATE,
} from './actions';

const exercisesReducer = (
  state: ExercisesState = {},
  action: ExerciseAction,
) => {
  switch (action.type) {
    case SET_EXERCISE_ACTIVE_STEP: {
      const exerciseId = action.meta.id;
      const newActiveStepId = action.payload;
      const exercise = state[exerciseId];
      return {
        ...state,
        [exerciseId]: {
          ...exercise,
          activeStep: newActiveStepId,
        },
      };
    }
    case UPDATE_EXERCISE: {
      const exerciseId = action.meta.id;
      const patch = action.payload;
      const exercise = state[exerciseId];
      return {
        ...state,
        [exerciseId]: {
          ...exercise,
          ...patch,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.exercises
        ? {
            ...state,
            ...action.payload.exercises,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};
const sectionsReducer = (state: SectionsState = {}, action: SectionAction) => {
  switch (action.type) {
    case ADD_SECTION_CHILD: {
      const sectionId = action.meta.id;
      const section = state[sectionId];
      return {
        ...state,
        [sectionId]: {
          ...section,
          children: [...section.children, action.payload],
        },
      };
    }
    case REMOVE_SECTION_CHILD: {
      const sectionId = action.meta.id;
      const child = action.payload;
      const section = state[sectionId];
      const childIndex = section.children.findIndex(
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
const stepsReducer = (state: StepsState = {}, action: StepAction) => {
  switch (action.type) {
    case UPDATE_STEP_STATE: {
      const stepId = action.meta.id;
      const statePatch = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          state: {
            ...step.state,
            ...statePatch,
          },
        },
      };
    }
    case UPDATE_STEP: {
      const stepId = action.meta.id;
      const patch = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          ...patch,
        },
      };
    }
    case UPDATE_ENTITIES: {
      return action.payload.steps
        ? {
            ...state,
            ...action.payload.steps,
          }
        : state;
    }
    default: {
      return state;
    }
  }
};

const reducer = combineReducers({
  [exerciseSchema.key]: exercisesReducer,
  [sectionSchema.key]: sectionsReducer,
  [stepSchema.key]: stepsReducer,
});

export { reducer };
