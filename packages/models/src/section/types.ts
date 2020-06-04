import { Step } from "../step";

export const TYPE_SECTION = "sections";

export type SectionChild = Step | Section;

export interface Section {
  id: string;
  children: SectionChild[];
  type: typeof TYPE_SECTION;
}

export interface NormalizedSection {
  id: Section["id"];
  children: [{ id: string; schema: string }];
  type: Section["type"];
}
