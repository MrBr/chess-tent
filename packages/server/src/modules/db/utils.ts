import { Schema } from "mongoose";
import { DB } from "@types";
import { v4 as uuid } from "uuid";
const transformRemove_id = <T>(
  doc: unknown,
  ret: T extends { _id: any } ? T : never
) => {
  delete ret._id;
  return ret;
};

export const createStandardSchema: DB["createStandardSchema"] = (
  definition,
  options = {},
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
        transform: transformRemove_id,
        ...(options.toJSON || {})
      },
      toObject: {
        virtuals: true,
        transform: transformRemove_id,
        ...(options.toObject || {})
      }
    }
  );
  return schema;
};
