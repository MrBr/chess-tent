import { model, Schema, Document } from "mongoose";
import {
  Lesson,
  NormalizedLesson,
  TYPE_LESSON,
  TYPE_USER
} from "@chess-tent/models";
import { db } from "@application";

const lessonSchema = db.createStandardSchema<NormalizedLesson>({
  owner: ({
    type: Schema.Types.ObjectId,
    ref: TYPE_USER
  } as unknown) as NormalizedLesson["owner"],
  state: ({
    type: Schema.Types.Mixed,
    required: true
  } as unknown) as NormalizedLesson["state"],
  type: ({
    type: String,
    default: TYPE_LESSON
  } as unknown) as typeof TYPE_LESSON
});

const LessonModel = model<Lesson & Document>(TYPE_LESSON, lessonSchema);

export { lessonSchema, LessonModel };
