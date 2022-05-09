import { model, Schema, SchemaOptions } from 'mongoose';
import { AppDocument, DB } from '@types';
import { v4 as uuid } from 'uuid';
import { DateRange } from '@chess-tent/types';

const createTransformRemoveId =
  <T>(transform?: (doc: any, ret: any, options: any) => any) =>
  (doc: unknown, ret: T extends { _id: any } ? T : never, options: any) => {
    delete ret._id;
    return transform ? transform(doc, ret, options) : ret;
  };

export const createSchema: DB['createSchema'] = <T extends {}>(
  definition: T,
  options: SchemaOptions = {},
  useDefault = true,
): Schema => {
  const defaultDefinition = {
    _id: { type: String, default: uuid, alias: 'id' } as unknown as string,
    v: {
      type: Schema.Types.Number,
      required: false,
      default: 0,
    } as unknown as number,
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
  return schema as unknown as Schema;
};

export const createModel: DB['createModel'] = <T>(
  type: string,
  schema: Schema,
) => {
  return model<AppDocument<T>>(type, schema);
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

// Transform to MongoDB format for array elem update
// More info: https://docs.mongodb.com/manual/reference/operator/update/positional-filtered/#examples
export const get$SetForArrayElemUpdate = (
  setObject: Record<string, any>,
  arrayName: string,
  elementName: string,
) => {
  const setPrefix = `${arrayName}.$[${elementName}]`;
  const newSet: Record<string, any> = {};
  Object.entries(setObject).forEach(
    ([key, value]) => (newSet[`${setPrefix}.${key}`] = value),
  );
  return newSet;
};

export const getOptionsForArrayElemUpdate = (
  elementName: string,
  ids: string[],
) => ({
  multi: true,
  arrayFilters: [{ [`${elementName}.id`]: { $in: ids } }],
});

export const get$SetAndOptionsForArrayElemUpdate = (
  setObject: Record<string, any>,
  arrayName: string,
  ids: string[],
) => {
  const elementName = 'elem';
  return {
    $set: get$SetForArrayElemUpdate(setObject, arrayName, elementName),
    options: getOptionsForArrayElemUpdate(elementName, ids),
  };
};

export const flattenBuckets = (buckets: any[], itemsKey: string) => {
  return buckets.reduce(
    (itemsAll: Record<string, any>, bucket: Record<string, any>) => {
      return bucket[itemsKey].concat(itemsAll);
    },
    [],
  );
};

export const getBucketingIdFilterRegex = (parentId: string) =>
  new RegExp(String.raw`^${parentId}_`);

export const getDateRangeFilter = (date: DateRange) => ({
  ...(date.from ? { $gte: new Date(date.from) } : undefined),
  ...(date.to ? { $lt: new Date(date.to) } : null),
});
