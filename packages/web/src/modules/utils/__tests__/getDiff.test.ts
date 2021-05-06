import { getDiff } from '../utils';

type TestSubject = { [key: string]: unknown };

describe('getDiff', () => {
  test('diff between string and object', () => {
    const oldSubject: TestSubject = {
      prop: 'string',
    };

    const newSubject: TestSubject = {
      prop: { nested: 1 },
    };

    expect(getDiff(oldSubject, newSubject)).toStrictEqual({
      prop: { nested: 1 },
    });
  });
  test('diff between object and string', () => {
    const oldSubject: TestSubject = {
      prop: { nested: 1 },
    };

    const newSubject: TestSubject = {
      prop: 'string',
    };

    expect(getDiff(oldSubject, newSubject)).toStrictEqual({
      prop: 'string',
    });
  });
  test('comparison between two objects', () => {
    const newSubject: TestSubject = {
      newObjectNotExistInOld: {},
    };

    const oldSubject: TestSubject = {
      oldObjectNotExistInNew: {},
    };
    expect(getDiff(oldSubject, newSubject)).toStrictEqual(newSubject);
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
      prop: {
        nested: 1,
      },
    };

    const oldSubject: TestSubject = {
      prop: undefined,
    };

    expect(getDiff(oldSubject, newSubject, {})).toStrictEqual(newSubject);
  });
  test('comparison between undefined and object', () => {
    const newSubject: TestSubject = {
      prop: undefined,
    };

    const oldSubject: TestSubject = {
      prop: {
        nested: 'something',
      },
    };

    expect(getDiff(oldSubject, newSubject)).toStrictEqual(newSubject);
  });
  test('comparison between undefined and array', () => {
    const oldSubject: TestSubject = {
      prop: undefined,
    };

    const newSubject: TestSubject = {
      prop: [{}],
    };

    expect(getDiff(oldSubject, newSubject)).toStrictEqual(newSubject);
  });
  test('comparison between nested objects', () => {
    const newSubject: TestSubject = {
      state: {
        chapters: [
          {
            state: {
              steps: [{ prop: 1 }],
            },
          },
        ],
      },
    };

    const oldSubject: TestSubject = {
      state: {
        chapters: [
          {
            state: {
              steps: [{ prop: 2 }],
            },
          },
        ],
      },
    };

    expect(getDiff(oldSubject, newSubject)).toStrictEqual({
      'state.chapters.0.state.steps.0.prop': 1,
    });
  });
});
