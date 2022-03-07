import { Schema } from '../index';

export const Types = {
  ROOT: 'root',
  NESTED: 'nested',
  ARRAY: 'array',
  ARRAY_NESTED: 'array_nested',
};

export const Models: Record<string, Schema> = {
  [Types.ROOT]: {
    type: Types.ROOT,
    relationships: {
      root: Types.ROOT,
    },
  },
  [Types.NESTED]: {
    type: Types.ROOT,
    relationships: {
      parent: {
        nested: Types.ROOT,
      },
    },
  },
  [Types.ARRAY]: {
    type: Types.ROOT,
    relationships: {
      arr: Types.ROOT,
    },
  },
  [Types.ARRAY_NESTED]: {
    type: Types.ROOT,
    relationships: {
      nestedArr: { nested: Types.ROOT },
    },
  },
};
