import { getDiff } from '../utils/getDiff';

describe('getDiff', () => {
  test('diff between string and object', () => {
    const oldSubject = {
      prop: 'string',
    };

    const newSubject = {
      prop: { nested: 1 },
    };

    expect(getDiff(oldSubject, newSubject)).toEqual({
      prop: { nested: 1 },
    });
  });
  test('diff between object and string', () => {
    const oldSubject = {
      prop: { nested: 1 },
    };

    const newSubject = {
      prop: 'string',
    };

    expect(getDiff(oldSubject, newSubject)).toEqual({
      prop: 'string',
    });
  });
  test('comparison between two objects', () => {
    const newSubject = {};
    const oldSubject = {};

    expect(getDiff(oldSubject, newSubject)).toEqual(newSubject);
  });
  test('comparison between two arrays', () => {
    const newSubject = [1];
    const oldSubject = [1];

    expect(getDiff(oldSubject, newSubject)).toEqual({});
  });
  test('comparison between two different arrays', () => {
    const oldSubject = [{ a: 1 }, { b: 1 }, { c: 1 }];
    const newSubject = [{ a: 1 }, { c: 1 }];

    const diff = getDiff(oldSubject, newSubject);
    expect(diff).toEqual({
      '1.b': undefined,
      '1.c': 1,
      '2': undefined,
    });
  });
  test('comparison between same props ', () => {
    const newSubject = {
      sameStringInOldAndNew: 'same',
      sameObjectInOldAndNew: {},
      sameArrayInOldAndNew: [],
    };

    const oldSubject = {
      sameStringInOldAndNew: 'same',
      sameObjectInOldAndNew: {},
      sameArrayInOldAndNew: [],
      oldNotExistInNew: 'old',
    };
    expect(getDiff(oldSubject, newSubject)).toEqual({
      oldNotExistInNew: undefined,
    });
  });
  test('comparison between object and undefined', () => {
    const newSubject = {
      prop: {
        nested: 1,
      },
    };

    const oldSubject = {
      prop: undefined,
    };

    expect(getDiff(oldSubject, newSubject)).toEqual(newSubject);
  });
  test('comparison between undefined and object', () => {
    const newSubject = {
      prop: undefined,
    };

    const oldSubject = {
      prop: {
        nested: 'something',
      },
    };

    expect(getDiff(oldSubject, newSubject)).toEqual(newSubject);
  });
  test('comparison between undefined and array', () => {
    const oldSubject = {
      prop: undefined,
    };

    const newSubject = {
      prop: [{}],
    };

    expect(getDiff(oldSubject, newSubject)).toEqual(newSubject);
  });
  test('comparison between different nested object path', () => {
    const newSubject = {
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

    const oldSubject = {
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

    expect(getDiff(oldSubject, newSubject)).toEqual({
      'state.chapters.0.state.steps.0.prop': 1,
    });
  });
  test('comparison between different nested objects array', () => {
    const oldSubject = {
      state: {
        chapters: [
          {
            state: {
              steps: [{ a: 1 }, { b: 1 }, { c: 1 }],
            },
          },
        ],
      },
    };

    const newSubject = {
      state: {
        chapters: [
          {
            state: {
              steps: [{ a: 1 }, { c: 1 }],
            },
          },
        ],
      },
    };

    expect(getDiff(oldSubject, newSubject)).toEqual({
      'state.chapters.0.state.steps': [{ a: 1 }, { c: 1 }],
    });
  });
});
