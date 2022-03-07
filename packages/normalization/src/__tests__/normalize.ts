import initService from '../index';
import { Models, Types } from './utils';

describe('normalize', () => {
  test('root relationship', () => {
    const { normalize } = initService(Models);
    const { result, entities } = normalize({
      id: 1,
      type: Types.ROOT,
      test: 'test data',
      root: {
        id: 2,
        type: Types.ROOT,
      },
    });
    expect(result).toEqual({
      id: 1,
      type: Types.ROOT,
      root: 2,
      test: 'test data',
    });
    expect(entities[Types.ROOT]).toEqual({
      1: {
        id: 1,
        type: Types.ROOT,
        root: 2,
        test: 'test data',
      },
      2: {
        id: 2,
        type: Types.ROOT,
      },
    });
  });
  test('nested relationship', () => {
    const { normalize } = initService(Models);
    const { result, entities } = normalize({
      id: 1,
      type: Types.NESTED,
      parent: {
        test: 'test data',
        nested: {
          id: 2,
          type: Types.ROOT,
        },
      },
    });
    expect(result).toEqual({
      id: 1,
      type: Types.NESTED,
      parent: { nested: 2, test: 'test data' },
    });
    expect(entities[Types.NESTED]).toEqual({
      1: {
        id: 1,
        type: Types.NESTED,
        parent: { nested: 2, test: 'test data' },
      },
    });
    expect(entities[Types.ROOT]).toEqual({
      2: {
        id: 2,
        type: Types.ROOT,
      },
    });
  });
  test('array relationship', () => {
    const { normalize } = initService(Models);
    const { result, entities } = normalize({
      id: 1,
      type: Types.ARRAY,
      arr: [
        {
          id: 2,
          type: Types.ROOT,
        },
        {
          id: 3,
          type: Types.ROOT,
          test: 'test data',
        },
      ],
    });
    expect(result).toEqual({
      id: 1,
      type: Types.ARRAY,
      arr: [2, 3],
    });
    expect(entities[Types.ARRAY]).toEqual({
      1: {
        id: 1,
        type: Types.ARRAY,
        arr: [2, 3],
      },
    });
    expect(entities[Types.ROOT]).toEqual({
      2: {
        id: 2,
        type: Types.ROOT,
      },
      3: {
        id: 3,
        type: Types.ROOT,
        test: 'test data',
      },
    });
  });
  test('array nested relationship', () => {
    const { normalize } = initService(Models);
    const { result, entities } = normalize({
      id: 1,
      type: Types.ARRAY_NESTED,
      nestedArr: [
        {
          test: 'test data 2',
          nested: {
            id: 2,
            type: Types.ROOT,
          },
        },
        {
          test: 'test data 3',
          nested: {
            id: 3,
            type: Types.ROOT,
          },
        },
      ],
    });
    expect(result).toEqual({
      id: 1,
      type: Types.ARRAY_NESTED,
      nestedArr: [
        {
          test: 'test data 2',
          nested: 2,
        },
        {
          test: 'test data 3',
          nested: 3,
        },
      ],
    });
    expect(entities[Types.ARRAY_NESTED]).toEqual({
      1: {
        id: 1,
        type: Types.ARRAY_NESTED,
        nestedArr: [
          {
            test: 'test data 2',
            nested: 2,
          },
          {
            test: 'test data 3',
            nested: 3,
          },
        ],
      },
    });
    expect(entities[Types.ROOT]).toEqual({
      2: {
        id: 2,
        type: Types.ROOT,
      },
      3: {
        id: 3,
        type: Types.ROOT,
      },
    });
  });
});
