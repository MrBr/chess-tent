import { getDiff } from '../utils/utils';

type TestSubject = { [key: string]: unknown };

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
