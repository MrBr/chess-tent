import { Schema, SchemaOptions } from "mongoose";

export const setVirtualId = (schema: Schema) => {
  schema
    .virtual("id")
    .get(function() {
      // @ts-ignore
      return this._id;
    })
    // @ts-ignore
    .set(function(value) {
      // @ts-ignore
      this._id = value;
    });
  return schema;
};

export const transformRemove_id = (doc: { _id: any }) => {
  delete doc._id;
  return doc;
};

export const createStandardSchema = (
  definition: {},
  options: SchemaOptions = {}
) => {
  const schema = new Schema(definition, {
    ...options,
    toJSON: {
      virtuals: true,
      transform: transformRemove_id,
      ...(options.toJSON || {})
    },
    toObject: {
      virtuals: true,
      ...(options.toObject || {})
    }
  });
  setVirtualId(schema);
  return schema;
};
