import { model, Schema, Types } from "mongoose";

const stepsSchema = new Schema({
  state: Object,
  type: { type: String, default: "steps" },
  stepType: String
});

const StepModel = model("steps", stepsSchema);

new StepModel({
  state: { a: 1 },
  id: new Types.ObjectId("bacd4ee791d949af9ff7b591"),
  id1: new Types.ObjectId("bacd4ee791d949af9ff7b591"),
  type: "test123dasdsa"
}).save(err => {
  console.log(err);
});

export { StepModel, stepsSchema };
