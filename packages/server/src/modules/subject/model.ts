import { model, Schema, Document } from "mongoose";
import { Subject, TYPE_SUBJECT } from "@chess-tent/models";
import { db } from "@application";

const subjectSchema = db.createStandardSchema<Subject>({
  state: { type: Schema.Types.Mixed, required: true },
  type: ({
    type: String,
    default: TYPE_SUBJECT
  } as unknown) as typeof TYPE_SUBJECT
});

const SubjectModel = model<Subject & Document>(TYPE_SUBJECT, subjectSchema);

export { subjectSchema, SubjectModel };
