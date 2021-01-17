import { getDiff } from '../subject/service';

const newSubject = {
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
  nesto: { nestoDrugo: 'pero' },
  isto: {
    name: 'pero',
  },
};

test("should return { 'nesto.nestoDrugo.nestoUDrugom': 2, 'nesto.nestoTrece': 4 } ", () => {
  //@ts-ignore
  expect(getDiff(oldSubject, newSubject, {})).toStrictEqual({
    'nesto.nestoDrugo.nestoUDrugom': 2,
    'nesto.nestoTrece': 4,
  });
});
