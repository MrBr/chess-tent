import {ExerciseActionTypes, AppState, ExerciseAction, ExerciseState, StepInstance} from "../app/types";

const exerciseSelector = (state: AppState): ExerciseState => state.trainer;
const stepSelector = (stepId: StepInstance['id']) => (state: AppState) => exerciseSelector(state).steps.find(item => item.id === stepId);

const reducer = (state: ExerciseState = { steps: [], activeStepId: null }, action: ExerciseAction) => {
  switch (action.type) {
    case ExerciseActionTypes.SET_EXERCISE_STATE: {
      return {
        ...state,
        ...action.payload,
      }
    }
    case ExerciseActionTypes.SET_STEP_STATE: {
      return {
        ...state,
        // TODO - normalize steps - move it out of the exercise
        steps: state.steps.map(step =>
          step.id === action.meta.id ?
            {
              ...step,
              state: { ...step.state, ...action.payload }
            }
            :
            step
        )
      }
    }
    default: {
      return state;
    }
  }
};

export {
  stepSelector,
  exerciseSelector,
  reducer,
}
