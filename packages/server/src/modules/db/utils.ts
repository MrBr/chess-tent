import { Document, model, Schema, SchemaOptions } from "mongoose";
import { DB } from "@types";
import { v4 as uuid } from "uuid";

const createTransformRemove_id = <T>(
  transform?: (doc: any, ret: any, options: any) => any
) => (doc: unknown, ret: T extends { _id: any } ? T : never, options: any) => {
  delete ret._id;
  return transform ? transform(doc, ret, options) : ret;
};

export const createSchema: DB["createSchema"] = <T extends {}>(
  definition: T,
  options: SchemaOptions = {},
  useDefault = true
) => {
  const defaultDefinition = {
    _id: ({ type: String, default: uuid, alias: "id" } as unknown) as string
  };
  const schema = new Schema<typeof definition>(
    {
      ...(useDefault ? defaultDefinition : {}),
      ...definition
    },
    {
      _id: false,
      id: true,
      ...options,
      toJSON: {
        virtuals: true,
        ...(options.toJSON || {}),
        transform: createTransformRemove_id(options.toJSON?.transform)
      },
      toObject: {
        virtuals: true,
        ...(options.toObject || {}),
        transform: createTransformRemove_id(options.toObject?.transform)
      }
    }
  );
  return schema;
};

export const createModel: DB["createModel"] = <T>(
  type: string,
  schema: Schema
) => {
  const newModel = model<Document & T>(type, schema);
  return newModel;
};
