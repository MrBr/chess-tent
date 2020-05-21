import { ComponentType } from "react";

type ExerciseComponent = ComponentType;
let ExerciseRenderer;

const registerExercise = (exerciseComponent: ExerciseComponent) => {
  ExerciseRenderer = exerciseComponent;
};

export { registerExercise, ExerciseRenderer };
