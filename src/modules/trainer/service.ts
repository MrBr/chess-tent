import { Schema } from 'normalizr';
import _ from 'lodash';
import {
  Exercise,
  exerciseSchema,
  Section,
  SectionChild,
  sectionSchema,
  Step,
  Steps,
  stepSchema,
} from '../app/types';

// Step
const isStep = (entity: unknown): entity is Steps => {
  if (typeof entity === 'object') {
    return Object.getOwnPropertyDescriptor(entity, 'schema')?.value === 'steps';
  }
  return false;
};

const createStep = <T>(
  id: string,
  type: T extends Step<infer U, infer K> ? K : never,
  state: T extends Step<infer U, infer K> ? U : never,
): Step<typeof state, typeof type> => ({
  id,
  type,
  schema: 'steps',
  state,
});

// Section
const isSection = (entity: unknown): entity is Section => {
  if (typeof entity === 'object') {
    return (
      Object.getOwnPropertyDescriptor(entity, 'schema')?.value === 'sections'
    );
  }
  return false;
};

const getItemSection = (
  section: Section,
  item: SectionChild,
): Section | undefined => {
  if (!!section.children.find(child => child === item)) {
    return section;
  }
  for (const child of section.children) {
    const childSection = isSection(child) && getItemSection(child, item);
    if (childSection) {
      return childSection;
    }
  }
};

const getSectionLastStep = (section: Section): Steps | undefined => {
  let lastStep;
  _.forEachRight(section.children, (child: SectionChild) => {
    if (isStep(child)) {
      lastStep = child;
      return false;
    }
    const childSectionLastStep = getSectionLastStep(child);
    if (childSectionLastStep) {
      lastStep = childSectionLastStep;
      return false;
    }
  });
  return lastStep;
};

const getSectionPreviousStep = (
  section: Section,
  step: Steps,
): Steps | undefined | null => {
  let lastStep = null;
  for (const child of section.children) {
    if (child === step) {
      // Found searched step, returning previous.
      // If the first or the only returning null otherwise returning previous step.
      return lastStep;
    }
    if (isStep(child)) {
      lastStep = child;
    } else if (isSection(child)) {
      const prevStep = getSectionPreviousStep(child, step);
      if (prevStep) {
        // Searched step has previous step in its section.
        return prevStep;
      } else if (prevStep === null) {
        // Searched step is the first or the only step in the section
        // Returning previous step
        return lastStep;
      }
    }
  }
};

const addChild = (section: Section, child: SectionChild): Section => {
  return {
    ...section,
    children: [...section.children, child],
  };
};

const removeChild = (section: Section, child: SectionChild): Section => {
  const childIndex = section.children.findIndex(item => item === child);
  // Removes all the children affected by removed child - all that are afterward
  const children = section.children.slice(0, childIndex - 1);
  return {
    ...section,
    children,
  };
};

const createSection = (id: string, children: SectionChild[]): Section => ({
  id,
  children,
  schema: 'sections',
});

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
  return getItemSection(exercise.section, exercise.activeStep) as Section;
};

const getExercisePreviousStep = (exercise: Exercise, step: Steps) => {
  return getSectionPreviousStep(exercise.section, step);
};

const setActiveStep = (exercise: Exercise, step: Steps): Exercise => {
  return {
    ...exercise,
    activeStep: step,
  };
};

const createExercise = (
  id: string,
  section: Section,
  activeStep: Steps,
): Exercise => ({
  id,
  schema: 'exercises',
  section: section,
  activeStep,
});

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
  // Exercise
  isExercise,
  getEntitySchema,
  getExercisePreviousStep,
  createExercise,
  // Section
  isSection,
  getSectionLastStep,
  getItemSection,
  getSectionPreviousStep,
  getActiveStepSection,
  addChild,
  removeChild,
  setActiveStep,
  createSection,
  // Step
  isStep,
  createStep,
};
