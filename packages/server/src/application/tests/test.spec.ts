import { utils } from '@application';
describe('test', () => {
  it('should pass', () => {
    expect(utils.notNullOrUndefined({})).toEqual({});
  });
});
