import { combineReducers } from 'redux';

import {
  exerciseSchema,
  sectionSchema,
  stepSchema,
  StepsState,
  ExercisesState,
  SectionsState,
} from '../../app/types';
import { isSection, isStep } from '../service';
import {
  ADD_SECTION_SECTION,
  ADD_SECTION_STEP,
  ADD_STEP_MOVE,
  ADD_STEP_SHAPE,
  ExerciseAction,
  REMOVE_SECTION_SECTION,
  REMOVE_SECTION_STEP,
  REMOVE_STEP_MOVE,
  REMOVE_STEP_SHAPE,
  SectionAction,
  SET_EXERCISE_ACTIVE_STEP,
  SET_EXERCISES,
  SET_SECTIONS,
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
    case ADD_STEP_MOVE: {
      const stepId = action.meta.id;
      const move = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          moves: [...step.moves, move],
        },
      };
    }
    case ADD_STEP_SHAPE: {
      const stepId = action.meta.id;
      const shape = action.payload;
      const step = state[stepId];
      return {
        ...state,
        [stepId]: {
          ...step,
          shapes: [...step.shapes, shape],
        },
      };
    }
    case REMOVE_STEP_MOVE: {
      const stepId = action.meta.id;
      const move = action.payload;
      const step = state[stepId];
      const moveIndex = step.moves.findIndex(item => item === move);
      const moves = step.moves.slice(0, moveIndex - 1);
      return {
        ...state,
        [stepId]: {
          ...step,
          moves: moves,
        },
      };
    }
    case REMOVE_STEP_SHAPE: {
      const stepId = action.meta.id;
      const shape = action.payload;
      const step = state[stepId];
      const shapeIndex = step.shapes.findIndex(item => item === shape);
      const shapes = step.shapes.filter((shape, index) => index === shapeIndex);
      return {
        ...state,
        [stepId]: {
          ...step,
          shapes,
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
