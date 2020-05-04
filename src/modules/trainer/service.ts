import { Schema } from 'normalizr';
import {
  Exercise,
  exerciseSchema,
  Section,
  sectionSchema,
  StepInstance,
  stepSchema,
} from '../app/types';

// Step
const isStep = (entity: unknown): entity is StepInstance => {
  if (typeof entity === 'object') {
    return Object.getOwnPropertyDescriptor(entity, 'schema')?.value === 'steps';
  }
  return false;
};

// Section
const isSection = (entity: unknown): entity is Section => {
  if (typeof entity === 'object') {
    return (
      Object.getOwnPropertyDescriptor(entity, 'schema')?.value === 'sections'
    );
  }
  return false;
};

const findStepSection = (
  section: Section,
  step: StepInstance,
): Section | undefined => {
  if (!!section.children.find(child => child === step)) {
    return section;
  }
  for (const child of section.children) {
    const childSection = isSection(child) && findStepSection(child, step);
    if (childSection) {
      return childSection;
    }
  }
};

const addChild = (section: Section, child: Section | StepInstance): Section => {
  return {
    ...section,
    children: [...section.children, child],
  };
};

const removeChild = (
  section: Section,
  child: Section | StepInstance,
): Section => {
  const childIndex = section.children.findIndex(item => item === child);
  // Removes all the children affected by removed child - all that are afterward
  const children = section.children.slice(0, childIndex - 1);
  return {
    ...section,
    children,
  };
};

// Exercise
const isExercise = (entity: unknown) => {
  if (typeof entity === 'object') {
    return (
      Object.getOwnPropertyDescriptor(entity, 'schema')?.value ===
      exerciseSchema.key
    );
  }
  return false;
};

const getActiveStepSection = (exercise: Exercise): Section => {
  return findStepSection(exercise.section, exercise.activeStep) as Section;
};

const setActiveStep = (exercise: Exercise, step: StepInstance): Exercise => {
  return {
    ...exercise,
    activeStep: step,
  };
};

// Utils
const getEntitySchema = (entity: unknown): Schema => {
  if (isStep(entity)) {
    return stepSchema;
  } else if (isSection(entity)) {
    return sectionSchema;
  } else if (isExercise(entity)) {
    return exerciseSchema;
  }
  throw Error(`Unknown entity: ${entity}.`);
};

export {
  isExercise,
  getEntitySchema,
  isSection,
  isStep,
  findStepSection,
  getActiveStepSection,
  addChild,
  removeChild,
  setActiveStep,
};
