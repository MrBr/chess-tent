import application from '@application';

beforeAll(() => application.test.start());

describe('Shuffle array', () => {
  it('should change array order', () => {
    const { shuffleArray } = application.utils;

    const originalArray = [1, 2, 3, 4, 5, 6, 7, 8];
    const shuffledArray = shuffleArray(originalArray);

    expect(originalArray).not.toEqual(shuffledArray);
  });
});
