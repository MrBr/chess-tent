import { model, Schema } from "mongoose";

const exerciseSchema = new Schema({
  activeStep: [{ type: Schema.Types.ObjectId, ref: "steps" }],
  sections: [{ type: Schema.Types.ObjectId, ref: "sections" }],
  type: { type: String, default: "exercises" }
});
const ExerciseModel = model("exercises", exerciseSchema);

export { exerciseSchema, ExerciseModel };
