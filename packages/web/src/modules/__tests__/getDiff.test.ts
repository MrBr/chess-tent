import { getDiff } from '../utils/utils';

type TestSubject = { [key: string]: unknown };

describe('getDiff', () => {
  test("should return { 'newObjectOldString:{} 'newArrayOldNumber: []' } ", () => {
    const newSubject: TestSubject = {
      newObjectOldString: {},
      newArrayOldNumber: [],
    };

    const oldSubject: TestSubject = {
      newObjectOldString: 'string',
      newArrayOldNumber: 1,
    };

    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
      newObjectOldString: {},
      newArrayOldNumber: [],
    });
  });
  test('should return { newStringOldObject: string, newStringOldArray: string }', () => {
    const newSubject: TestSubject = {
      newStringOldObject: 'string',
      newStringOldArray: 'string',
    };

    const oldSubject: TestSubject = {
      newStringOldObject: {},
      newStringOldArray: [],
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
      newStringOldObject: 'string',
      newStringOldArray: 'string',
    });
  });
  test('should return { newObjectNotExistInOld: {} }', () => {
    const newSubject: TestSubject = {
      newObjectNotExistInOld: {},
    };

    const oldSubject: TestSubject = {
      oldObjectNotExistInNew: {},
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('should return { newArrayNotExistInOld: [] }', () => {
    const newSubject: TestSubject = {
      newArrayNotExistInOld: [],
    };

    const oldSubject: TestSubject = {
      oldArrayNotExistInNew: [],
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('should return {} ', () => {
    const newSubject: TestSubject = {
      sameInOldAndNew: 'same',
    };

    const oldSubject: TestSubject = {
      sameInOldAndNew: 'same',
      oldNotExistInNew: 'old',
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({});
  });
  test('should return { newObjectOldUndefined: { something: "something" }}', () => {
    const newSubject: TestSubject = {
      newObjectOldUndefined: {
        something: 'something',
      },
    };

    const oldSubject: TestSubject = {
      newObjectOldUndefined: undefined,
    };

    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('should return { newUndefinedOldObject: undefined}', () => {
    const newSubject: TestSubject = {
      newUndefinedOldObject: undefined,
    };

    const oldSubject: TestSubject = {
      newUndefinedOldObject: {
        something: 'something',
      },
    };

    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
});
