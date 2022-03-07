import initService from '../index';
import { Models, Types } from './utils';

describe('denormalize', () => {
  test('root relationship', () => {
    const { normalize, denormalize } = initService(Models);
    const entity = {
      id: 1,
      type: Types.ROOT,
      test: 'test data',
      root: {
        id: 2,
        type: Types.ROOT,
      },
    };
    const { result, entities } = normalize(entity);
    const denormalizedEntity = denormalize(result.id, Types.ROOT, entities);
    expect(denormalizedEntity).toEqual(entity);
  });
  test('nested relationship', () => {
    const { normalize, denormalize } = initService(Models);
    const entity = {
      id: 1,
      type: Types.NESTED,
      parent: {
        test: 'test data',
        nested: {
          id: 2,
          type: Types.ROOT,
        },
      },
    };
    const { result, entities } = normalize(entity);
    const denormalizedEntity = denormalize(result.id, Types.NESTED, entities);
    expect(denormalizedEntity).toEqual(entity);
  });
  test('array relationship', () => {
    const { normalize, denormalize } = initService(Models);
    const entity = {
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
    };
    const { result, entities } = normalize(entity);
    const denormalizedEntity = denormalize(result.id, Types.ARRAY, entities);
    expect(denormalizedEntity).toEqual(entity);
  });
  test('array nested relationship', () => {
    const { normalize, denormalize } = initService(Models);
    const entity = {
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
    };
    const { result, entities } = normalize(entity);
    const denormalizedEntity = denormalize(
      result.id,
      Types.ARRAY_NESTED,
      entities,
    );
    expect(denormalizedEntity).toEqual(entity);
  });
});
