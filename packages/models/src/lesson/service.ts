import { Lesson, TYPE_LESSON } from "./types";
import { getItemSection, getSectionPreviousStep, Section } from "../section";
import { Step } from "../step";
import { updateSubjectState } from "../subject";

// Lesson
const isLesson = (entity: unknown) =>
  Object.getOwnPropertyDescriptor(entity, "type")?.value === TYPE_LESSON;

const getActiveStepSection = (lesson: Lesson): Section =>
  getItemSection(lesson.state.section, lesson.state.activeStep) as Section;

const getLessonPreviousStep = (lesson: Lesson, step: Step) =>
  getSectionPreviousStep(lesson.state.section, step);

const setActiveStep = (lesson: Lesson, step: Step): Lesson =>
  updateSubjectState(lesson, {
    activeStep: step
  });

const createLesson = (
  id: string,
  section: Section,
  activeStep: Step
): Lesson => ({
  id,
  type: TYPE_LESSON,
  state: {
    section: section,
    activeStep
  }
});

export {
  isLesson,
  getLessonPreviousStep,
  createLesson,
  getActiveStepSection,
  setActiveStep
};
