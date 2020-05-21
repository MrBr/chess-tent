import { ComponentType } from 'react';
import { schema } from 'normalizr';
import { sectionSchema } from '../section';
import { stepSchema } from '../step';

export let ExerciseComponent: ComponentType;

export const registerExercise = (exerciseComponent: ComponentType) => {
  ExerciseComponent = exerciseComponent;
};

export const exerciseSchema = new schema.Entity('exercises', {
  section: sectionSchema,
  activeStep: stepSchema,
});
