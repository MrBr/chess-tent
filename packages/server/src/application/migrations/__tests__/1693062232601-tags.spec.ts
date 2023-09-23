import application from '@application';

describe('Tags migration', () => {
  beforeAll(async () => {
    await application.test.start();
  });

  afterAll(async () => {
    await application.stop();
  });

  it('should have initial tags', async () => {
    const tags = await application.service.findTags('Opening');
    expect(tags[0].text).toBe('Opening');
  });
});
