import { model, Schema } from "mongoose";

const sectionOrStepSchema = new Schema({
  _id: Schema.Types.ObjectId,
  type: String
});

const sectionsSchema = new Schema({
  children: [
    {
      type: sectionOrStepSchema,
      ref: (item: any) => item.type
    }
  ],
  type: { type: String, default: "sections" }
});

const SectionModel = model("sections", sectionsSchema);

export { SectionModel, sectionsSchema };
