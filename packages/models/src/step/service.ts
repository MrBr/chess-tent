import { SCHEMA_STEP, Step } from "./types";

// Step
const isStep = (entity: unknown): entity is Step => {
  if (typeof entity === "object") {
    return (
      Object.getOwnPropertyDescriptor(entity, "schema")?.value === SCHEMA_STEP
    );
  }
  return false;
};

const createStep = <T>(
  id: string,
  type: T extends Step<infer U, infer K> ? K : never,
  state: T extends Step<infer U, infer K> ? U : never
): Step<typeof state, typeof type> => ({
  id,
  type,
  schema: SCHEMA_STEP,
  state
});

export { isStep, createStep };
