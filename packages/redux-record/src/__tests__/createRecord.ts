import {
  MF,
  RecipeCollection,
  RecipeMethod,
  RecordBase,
  RecordEntry,
  RecordEntryType,
} from '@types';
import { collectionRecipe, createRecord } from '../index';
import { mockStore } from './_helpers';

interface RecordCustomGet<V> extends RecordEntryType<V> {
  get: MF<() => RecordEntry<number, this['$meta']>>;
}

describe('createRecord', () => {
  test('should create base record', function () {
    const store = mockStore();
    const initRecord = createRecord<RecordBase<string, { metaProp: string }>>({
      initialValue: 'test',
      initialMeta: { metaProp: 'metaProp' },
    });
    const record = initRecord('key')(store);
    record.init();
    expect(record.get()?.meta.metaProp).toBe('metaProp');
    expect(record.get()?.value).toBe('test');
  });
  test('should override get method', function () {
    const store = mockStore();
    const initRecord = createRecord<
      Omit<RecordBase<string[], { metaProp: string }>, 'get'> &
        RecipeCollection<string> &
        RecordCustomGet<string[]>
    >({
      initialValue: ['test'],
      initialMeta: { metaProp: 'metaProp' },
      ...collectionRecipe,
      get: () => () => record => () => ({
        value: 1,
        meta: { recordKey: 'str', ...record.initialMeta },
      }),
    });
    const record = initRecord('key')(store);
    record.init();
    expect(record.get()?.meta.metaProp).toBe('metaProp');
    expect(record.get()?.value).toBe(1);
  });
  test('should create collection record', function () {
    const store = mockStore();
    const initRecord = createRecord<
      RecipeCollection<string, { test: boolean }> &
        RecordBase<string[], { metaProp: string }>
    >({
      ...collectionRecipe,
      initialValue: ['test'],
      initialMeta: {
        metaProp: 'metaProp',
        test: true,
      },
    });
    const record = initRecord('key')(store);
    record.init();
    expect(record.get()?.meta.metaProp).toBe('metaProp');
    expect(record.get()?.value).toStrictEqual(['test']);
  });
  test('should amend record meta', function () {
    const store = mockStore();
    const initRecord = createRecord<
      RecordBase<string, { metaProp: string; extraProp: string }>
    >({
      initialValue: 'test',
      initialMeta: { metaProp: 'metaProp' },
    });

    const record = initRecord('key')(store);
    record.amend({ extraProp: 'test' });

    expect(record.get()?.meta.extraProp).toBe('test');
  });
  test('should create collection record with added meta and "test" method', function () {
    const store = mockStore();
    const test: MF<() => string, RecordBase> = () => () => record => () =>
      record.get()?.value as string;
    const new1: MF<() => void, RecordBase> = () => () => () => () => {};
    const initRecord = createRecord<
      RecipeMethod<
        'test',
        () => string,
        [string],
        { testMethodMeta: boolean }
      > &
        RecipeMethod<'new', () => void, [string], { newMeta: string }> &
        RecordBase<string[], { prop: string }> &
        RecipeCollection<string>
    >({
      test,
      new: new1,
      ...collectionRecipe,
      initialValue: ['test'],
      initialMeta: {
        testMethodMeta: true,
        prop: 'str',
        newMeta: 'd',
      },
    });
    const record = initRecord('key')(store);
    record.init();
    expect(record.get()?.value).toStrictEqual(['test']);
    expect(record.test()).toStrictEqual(['test']);
  });
  test('should update value and meta', function () {
    const store = mockStore();
    const initRecord = createRecord<RecordBase<string, { prop: string }>>({
      initialValue: 'test',
      initialMeta: { prop: 'prop' },
    });
    const record = initRecord('key')(store);
    record.init();
    expect(record.get()?.meta.prop).toBe('prop');
    expect(record.get()?.value).toStrictEqual('test');
    record.update('new', { prop: 'newProp' });
    expect(record.get()?.meta.prop).toBe('newProp');
    expect(record.get()?.value).toStrictEqual('new');
  });
});
