import { model, Schema, Document } from "mongoose";
import {
  Difficulty,
  Lesson,
  NormalizedLesson,
  TYPE_LESSON,
  TYPE_TAG,
  TYPE_USER
} from "@chess-tent/models";
import { db } from "@application";

export interface DepupulatedLesson {
  id: NormalizedLesson["id"];
  type: NormalizedLesson["type"];
  owner: NormalizedLesson["owner"];
  state: NormalizedLesson["state"];
  difficulty: NormalizedLesson["difficulty"];
  tags: NormalizedLesson["tags"];
}

export type LessonDocument = DepupulatedLesson & Document;

const lessonSchema = db.createStandardSchema<DepupulatedLesson>(
  {
    owner: ({
      type: String,
      ref: TYPE_USER
    } as unknown) as DepupulatedLesson["owner"],
    state: ({
      type: Schema.Types.Mixed,
      required: true
    } as unknown) as DepupulatedLesson["state"],
    difficulty: ({
      type: String,
      enum: Object.keys(Difficulty),
      required: true,
      index: true
    } as unknown) as DepupulatedLesson["difficulty"],
    tags: [
      {
        type: String,
        ref: TYPE_TAG
      } as unknown
    ] as DepupulatedLesson["tags"],
    type: ({
      type: String,
      default: TYPE_LESSON
    } as unknown) as typeof TYPE_LESSON
  },
  { minimize: false }
);

const LessonModel = model<LessonDocument>(TYPE_LESSON, lessonSchema);

const depopulate = (lesson: Partial<Lesson>): DepupulatedLesson => {
  const owner = lesson.owner?.id;
  return (owner ? { ...lesson, owner } : lesson) as DepupulatedLesson;
};

export { lessonSchema, LessonModel, depopulate };
