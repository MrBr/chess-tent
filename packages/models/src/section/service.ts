import _ from "lodash";
import { SCHEMA_SECTION, Section, SectionChild } from "./types";
import { isStep, Step } from "../step";

const isSection = (entity: unknown): entity is Section => {
  if (typeof entity === "object") {
    return (
      Object.getOwnPropertyDescriptor(entity, "type")?.value === SCHEMA_SECTION
    );
  }
  return false;
};

const getItemSection = (
  section: Section,
  item: SectionChild
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

const getSectionLastStep = (section: Section): Step | undefined => {
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
  step: Step
): Step | undefined | null => {
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
    children: [...section.children, child]
  };
};

const removeChild = (section: Section, child: SectionChild): Section => {
  const childIndex = section.children.findIndex(item => item === child);
  // Removes all the children affected by removed child - all that are afterward
  const children = section.children.slice(0, childIndex - 1);
  return {
    ...section,
    children
  };
};

const createSection = (id: string, children: SectionChild[]): Section => ({
  id,
  children,
  type: SCHEMA_SECTION
});

export {
  isSection,
  getSectionLastStep,
  getItemSection,
  getSectionPreviousStep,
  addChild,
  removeChild,
  createSection
};
