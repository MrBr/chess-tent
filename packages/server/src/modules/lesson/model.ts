import { Schema } from "mongoose";
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

const lessonSchema = db.createSchema<DepupulatedLesson>(
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

const LessonModel = db.createModel<DepupulatedLesson>(
  TYPE_LESSON,
  lessonSchema
);

const depopulate = (lesson: Partial<Lesson>): DepupulatedLesson => {
  const owner = lesson.owner?.id;
  const tags = lesson.tags?.map(tag => tag.id);
  return (owner ? { ...lesson, owner, tags } : lesson) as DepupulatedLesson;
};

export { lessonSchema, LessonModel, depopulate };
