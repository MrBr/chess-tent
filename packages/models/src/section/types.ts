import { Step } from "../step";

export const SCHEMA_SECTION = "sections";

export type SectionChild = Step | Section;

export interface Section {
  id: string;
  children: SectionChild[];
  schema: typeof SCHEMA_SECTION;
}

export interface NormalizedSection {
  id: Section["id"];
  children: [{ id: string; schema: string }];
  schema: Section["schema"];
}
