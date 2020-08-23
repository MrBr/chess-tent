import { model, Schema, Document } from "mongoose";
import {
  Lesson,
  NormalizedLesson,
  TYPE_LESSON,
  TYPE_USER
} from "@chess-tent/models";
import { db } from "@application";

export interface DepupulatedLesson {
  id: Lesson["id"];
  type: Lesson["type"];
  owner: Lesson["owner"]["id"];
  state: Lesson["state"];
}

export type LessonDocument = DepupulatedLesson & Document;

const lessonSchema = db.createStandardSchema<DepupulatedLesson>({
  owner: ({
    type: String,
    ref: TYPE_USER
  } as unknown) as DepupulatedLesson["owner"],
  state: ({
    type: Schema.Types.Mixed,
    required: true
  } as unknown) as DepupulatedLesson["state"],
  type: ({
    type: String,
    default: TYPE_LESSON
  } as unknown) as typeof TYPE_LESSON
});

const LessonModel = model<LessonDocument>(TYPE_LESSON, lessonSchema);

const depopulate = (lesson: Lesson): DepupulatedLesson => {
  return { ...lesson, owner: lesson.owner.id };
};

export { lessonSchema, LessonModel, depopulate };
