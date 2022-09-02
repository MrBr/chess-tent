import {
  createRecord,
  withRecordBase,
  withRecordCollection,
  withRecordMeta,
  withRecordMethod,
} from '../index';
import { mockStore } from './_helpers';

describe('createRecord', () => {
  test('should create base record', function () {
    const store = mockStore();
    const initRecord = createRecord(
      withRecordBase<string, { prop: string }>('test', { prop: 'prop' }),
    );
    const record = initRecord('key')(store);
    expect(record.get().meta.prop).toBe('prop');
    expect(record.get().value).toBe('test');
  });
  test('should create collection record', function () {
    const store = mockStore();
    const initRecord = createRecord(
      withRecordBase<string[], { prop: string }>(['test'], { prop: 'prop' }),
      withRecordCollection(),
    );
    const record = initRecord('key')(store);
    expect(record.get().meta.prop).toBe('prop');
    expect(record.get().value).toStrictEqual(['test']);
  });
  test('should create collection record with added meta', function () {
    const store = mockStore();
    const initRecord = createRecord(
      withRecordBase<string[], { prop: string }>(['test'], { prop: 'prop' }),
      withRecordCollection(),
      withRecordMeta<{ addedProp: string }>()(),
    );
    const record = initRecord('key')(store);
    expect(record.get().meta.prop).toBe('prop');
    expect(record.get().meta.addedProp).toBe(undefined);
    expect(record.get().value).toStrictEqual(['test']);
  });
  test('should create collection record with added meta and "test" method', function () {
    const store = mockStore();
    const initRecord = createRecord(
      withRecordBase<string[], { prop: string }>(['test'], { prop: 'prop' }),
      withRecordCollection(),
      withRecordMeta<{ addedProp: string }>()(),
      withRecordMethod('test', () => () => record => () => {
        return record.get().value;
      }),
    );
    const record = initRecord('key')(store);
    expect(record.get().meta.prop).toBe('prop');
    expect(record.get().meta.addedProp).toBe(undefined);
    expect(record.get().value).toStrictEqual(['test']);
    expect(record.test()).toStrictEqual(['test']);
  });
  test('should update value and meta', function () {
    const store = mockStore();
    const initRecord = createRecord(
      withRecordBase<string[], { prop: string }>(['test'], { prop: 'prop' }),
    );
    const record = initRecord('key')(store);
    expect(record.get().meta.prop).toBe('prop');
    expect(record.get().value).toStrictEqual(['test']);
    record.update(['new'], { prop: 'newProp' });
    expect(record.get().meta.prop).toBe('newProp');
    expect(record.get().value).toStrictEqual(['new']);
  });
});
