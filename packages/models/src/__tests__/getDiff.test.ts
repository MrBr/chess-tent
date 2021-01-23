import { Subject } from '@chess-tent/models';
import { getDiff } from '../subject/service';

type TestSubject = { [key: string]: unknown } & Subject;

test("should return { 'nesto.nestoDrugo.nestoUDrugom': 2, 'nesto.nestoTrece': 4 } ", () => {
  const newSubject: TestSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: {
      nestoDrugo: {
        nestoUDrugom: 2,
      },
      nestoTrece: 4,
    },
    isto: {
      name: 'pero',
    },
  };

  const oldSubject: TestSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: { nestoDrugo: 'pero' },
    isto: {
      name: 'pero',
    },
  };

  expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
    'nesto.nestoDrugo.nestoUDrugom': 2,
    'nesto.nestoTrece': 4,
  });
});

test("should return { 'nesto.nestoDrugo.nestoUDrugom': 2, 'nesto.nestoTrece': 4 } ", () => {
  const newSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: {
      nestoDrugo: {
        nestoUDrugom: 2,
      },
      nestoTrece: 4,
    },
    isto: {
      name: 'pero',
    },
  };

  const oldSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: undefined,
    isto: {
      name: 'pero',
    },
  };

  expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
    'nesto.nestoDrugo.nestoUDrugom': 2,
    'nesto.nestoTrece': 4,
  });
});

test("should return { 'nesto.nestoDrugo.nestoUDrugom': 2, 'nesto.nestoTrece': 4 } ", () => {
  const newSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: {
      nestoDrugo: {
        nestoUDrugom: 2,
      },
      nestoTrece: 4,
      nestoCetvrto: [{ test: 'test' }, { test1: 'test1' }],
    },
    isto: {
      name: 'pero',
    },
  };

  const oldSubject = {
    id: 'test',
    type: 'test',
    state: {},
    nesto: {
      nestoDrugo: {
        nestoUDrugom: 2,
      },
      nestoTrece: 4,
      nestoCetvrto: 'nestoCetvrto',
    },
    isto: {
      name: 'pero',
    },
  };

  expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
    nestoCetvrto: [{ test: 'test' }, { test1: 'test1' }],
  });
});
