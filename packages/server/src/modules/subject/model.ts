import { model, Schema } from "mongoose";
import { TYPE_SUBJECT } from "@chess-tent/models";
import { db } from "@application";

const subjectSchema = db.createStandardSchema(
  {
    _id: Schema.Types.ObjectId,
    state: { type: Schema.Types.Mixed, required: true },
    type: { type: String, default: TYPE_SUBJECT }
  },
  { _id: false, id: true }
);

const SubjectModel = model(TYPE_SUBJECT, subjectSchema);

export { subjectSchema, SubjectModel };
