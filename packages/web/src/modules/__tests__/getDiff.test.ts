import { getDiff } from '../utils/utils';

type TestSubject = { [key: string]: unknown };

describe('getDiff', () => {
  test('diff between object and array vs string and number', () => {
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
  test('diff between strings vs object and array', () => {
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
  test('comparison between two objects', () => {
    const newSubject: TestSubject = {
      newObjectNotExistInOld: {},
    };

    const oldSubject: TestSubject = {
      oldObjectNotExistInNew: {},
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('comparison between two arrays', () => {
    const newSubject: TestSubject = {
      newArrayNotExistInOld: [],
    };

    const oldSubject: TestSubject = {
      oldArrayNotExistInNew: [],
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('comparison between same props ', () => {
    const newSubject: TestSubject = {
      sameStringInOldAndNew: 'same',
      sameObjectInOldAndNew: {},
      sameArrayInOldAndNew: [],
    };

    const oldSubject: TestSubject = {
      sameStringInOldAndNew: 'same',
      sameObjectInOldAndNew: {},
      sameArrayInOldAndNew: [],
      oldNotExistInNew: 'old',
    };
    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({});
  });
  test('comparison between object and undefined', () => {
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
  test('comparison between undefined and object', () => {
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
