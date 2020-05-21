import { model, Schema, Types } from "mongoose";

const stepsSchema = new Schema({
  state: Object,
  _schema: { type: String, default: "steps" },
  type: String
});

const StepModel = model("steps", stepsSchema);

export { StepModel, stepsSchema };
