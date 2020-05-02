import { Exercise, Section, StepInstance } from '../app/types';

// Step
const isStep = (entity: unknown): entity is StepInstance => {
  if (typeof entity === 'object') {
    return Object.getOwnPropertyDescriptor(entity, 'schema')?.value === 'steps';
  }
  return false;
};
//  && !!entity && entity.hasOwnProperty('scheme');

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
  return section.children.find(child =>
    isSection(child) ? findStepSection(child, step) : undefined,
  ) as Section | undefined; // ts doesn't get type guard
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
const getActiveStepSection = (exercise: Exercise): Section => {
  return findStepSection(exercise.section, exercise.activeStep) as Section;
};

const setActiveStep = (exercise: Exercise, step: StepInstance): Exercise => {
  return {
    ...exercise,
    activeStep: step,
  };
};

export {
  isSection,
  isStep,
  findStepSection,
  getActiveStepSection,
  addChild,
  removeChild,
  setActiveStep,
};
