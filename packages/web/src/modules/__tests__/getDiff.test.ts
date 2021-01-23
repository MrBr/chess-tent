import { getDiff } from '../utils/utils';

type TestSubject = { [key: string]: unknown };

describe('getDiff', () => {
  test("should return { 'newObjectOldString:{} 'newArrayOldNumber: []', newObjectNotExistInArray: {} } ", () => {
    const newSubject: TestSubject = {
      newObjectOldString: {},
      newArrayOldNumber: [],
      newObjectNotExistInOld: {},
    };

    const oldSubject: TestSubject = {
      newObjectOldString: 'string',
      newArrayOldNumber: 1,
    };

    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
      newObjectOldString: {},
      newArrayOldNumber: [],
      newObjectNotExistInOld: {},
    });
  });
  test("should return { newObjectOldUndefined: { something: 'something'}}", () => {
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
