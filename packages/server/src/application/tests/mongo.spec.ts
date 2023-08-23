import application from '@application';

describe('Database test', () => {
  beforeAll(async () => {
    await application.test.start();
  });

  afterAll(async () => {
    await application.stop();
  });

  it('should return ready state "connected"', () => {
    expect(application.db.connection.readyState).toBe(1);
  });
});
