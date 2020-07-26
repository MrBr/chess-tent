import { Schema } from "mongoose";
import { DB } from "@types";

const transformRemove_id = <T>(
  doc: unknown,
  ret: T extends { _id: any } ? T : never
) => {
  delete ret._id;
  return ret;
};

export const createStandardSchema: DB["createStandardSchema"] = (
  definition,
  options = {}
) => {
  const schema = new Schema<typeof definition>(
    {
      _id: ({ type: Schema.Types.ObjectId, alias: "id" } as unknown) as string,
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
