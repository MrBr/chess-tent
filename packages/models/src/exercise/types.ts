import { Section } from "../section";
import { Step } from "../step";

export const SCHEMA_EXERCISE = "exercises";

export interface Exercise {
  id: string;
  section: Section;
  activeStep: Step;
  schema: typeof SCHEMA_EXERCISE;
}

export interface NormalizedExercise {
  id: Exercise["id"];
  schema: Exercise["schema"];
  activeStep: Step["id"];
  section: Section["id"];
}
