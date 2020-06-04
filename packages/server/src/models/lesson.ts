import { model, Schema } from "mongoose";
import { createStandardSchema } from "./helpers";
import { TYPE_LESSON } from "@chess-tent/models";

const lessonSchema = createStandardSchema({
  state: Schema.Types.Mixed,
  type: { type: String, default: TYPE_LESSON }
});

const LessonModel = model(TYPE_LESSON, lessonSchema);

export { lessonSchema, LessonModel };
