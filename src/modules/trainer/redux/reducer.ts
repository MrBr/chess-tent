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
  ADD_SECTION_SECTION,
  ADD_SECTION_STEP,
  ExerciseAction,
  REMOVE_SECTION_SECTION,
  REMOVE_SECTION_STEP,
  SectionAction,
  SET_EXERCISE_ACTIVE_STEP,
  SET_EXERCISES,
  SET_SECTIONS,
  UPDATE_STEP_STATE,
  SET_STEPS,
  StepAction,
  UPDATE_EXERCISE,
  UPDATE_STEP,
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
    case SET_EXERCISES: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
const sectionsReducer = (state: SectionsState = {}, action: SectionAction) => {
  switch (action.type) {
    case ADD_SECTION_STEP: {
      const sectionId = action.meta.id;
      const childId = action.payload;
      const section = state[sectionId];
      return {
        ...state,
        [sectionId]: {
          ...section,
          children: [
            ...section.children,
            { id: childId, scheme: stepSchema.key },
          ],
        },
      };
    }
    case ADD_SECTION_SECTION: {
      const sectionId = action.meta.id;
      const childId = action.payload;
      const section = state[sectionId];
      return {
        ...state,
        [sectionId]: {
          ...section,
          children: [
            ...section.children,
            { id: childId, scheme: sectionSchema.key },
          ],
        },
      };
    }
    case REMOVE_SECTION_STEP: {
      const sectionId = action.meta.id;
      const childId = action.payload;
      const section = state[sectionId];
      const childIndex = section.children.findIndex(
        item => isStep(item) && item.id === childId,
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
    case REMOVE_SECTION_SECTION: {
      const sectionId = action.meta.id;
      const childId = action.payload;
      const section = state[sectionId];
      const childIndex = section.children.findIndex(
        item => isSection(item) && item.id === childId,
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
    case SET_SECTIONS: {
      return {
        ...state,
        ...action.payload,
      };
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
    case SET_STEPS: {
      return {
        ...state,
        ...action.payload,
      };
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
