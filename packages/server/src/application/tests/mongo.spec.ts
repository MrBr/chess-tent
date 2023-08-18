import application from '@application';

describe('Sample Test', () => {
  beforeAll(async () => {
    await application.start();
  });

  afterAll(async () => {
    await application.stop();
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });
});
