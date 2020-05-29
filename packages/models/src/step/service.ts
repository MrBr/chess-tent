import { SCHEMA_STEP, Step } from "./types";

// Step
const isStep = (entity: unknown): entity is Step => {
  if (typeof entity === "object") {
    return (
      Object.getOwnPropertyDescriptor(entity, "type")?.value === SCHEMA_STEP
    );
  }
  return false;
};

const createStep = <T>(
  id: string,
  stepType: T extends Step<infer U, infer K> ? K : never,
  state: T extends Step<infer U, infer K> ? U : never
): Step<typeof state, typeof stepType> => ({
  id,
  stepType,
  type: SCHEMA_STEP,
  state
});

export { isStep, createStep };
