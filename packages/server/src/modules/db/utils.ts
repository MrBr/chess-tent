import { Document, model, Schema, SchemaOptions } from 'mongoose';
import { DB } from '@types';
import { v4 as uuid } from 'uuid';

const createTransformRemoveId = <T>(
  transform?: (doc: any, ret: any, options: any) => any,
) => (doc: unknown, ret: T extends { _id: any } ? T : never, options: any) => {
  delete ret._id;
  return transform ? transform(doc, ret, options) : ret;
};

export const createSchema: DB['createSchema'] = <T extends {}>(
  definition: T,
  options: SchemaOptions = {},
  useDefault = true,
) => {
  const defaultDefinition = {
    _id: ({ type: String, default: uuid, alias: 'id' } as unknown) as string,
    v: ({
      type: Schema.Types.Number,
      required: false,
      default: 0,
    } as unknown) as number,
  };
  const schema = new Schema<typeof definition>(
    {
      ...(useDefault ? defaultDefinition : {}),
      ...definition,
    },
    {
      _id: false,
      id: true,
      ...options,
      toJSON: {
        virtuals: true,
        ...(options.toJSON || {}),
        transform: createTransformRemoveId(options.toJSON?.transform),
      },
      toObject: {
        virtuals: true,
        ...(options.toObject || {}),
        transform: createTransformRemoveId(options.toObject?.transform),
      },
      versionKey: false,
    },
  );
  return schema;
};

export const createModel: DB['createModel'] = <T>(
  type: string,
  schema: Schema,
) => {
  const newModel = model<Document & T>(type, schema);
  return newModel;
};

export const orQueries: DB['orQueries'] = (...queries) => {
  const filteredQueries = queries.filter(
    query => Object.keys(query).length > 0,
  );
  return { $or: filteredQueries?.length > 0 ? filteredQueries : undefined };
};
export const inQuery: DB['inQuery'] = (field, value) => {
  if (!value) {
    return {};
  }
  return { [field]: { $in: value } };
};

export const dotNotate = (
  obj: Record<string, any>,
  target: Record<string, any> = {},
  prefix = '',
) => {
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'object') {
      dotNotate(obj[key], target, prefix + key + '.');
    } else {
      return (target[prefix + key] = obj[key]);
    }
  });
  return target;
};

export const flattenBuckets = (buckets: any[], itemsKey: string) => {
  return buckets.reduce(
    (itemsAll: Record<string, any>, bucket: Record<string, any>) => {
      return itemsAll.concat(bucket[itemsKey]);
    },
    [],
  );
};

export const getBucketingIdFilterRegex = (parentId: string) =>
  new RegExp(String.raw`^${parentId}_`);
