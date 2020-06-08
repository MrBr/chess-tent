import { Schema } from "mongoose";
import { DB } from "@types";
import { Subject } from "@chess-tent/models";

const setVirtualId = (schema: Schema) => {
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

const transformRemove_id = <T>(doc: T extends { _id: any } ? T : never) => {
  delete doc._id;
  return doc;
};

export const createStandardSchema: DB["createStandardSchema"] = (
  definition,
  options = {}
) => {
  const schema = new Schema<typeof definition>(
    {
      _id: (Schema.Types.ObjectId as unknown) as string,
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
        ...(options.toObject || {})
      }
    }
  );
  setVirtualId(schema);
  return schema;
};
