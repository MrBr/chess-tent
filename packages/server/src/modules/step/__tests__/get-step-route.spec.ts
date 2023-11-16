import request from 'supertest';
import { v4 as uuid } from 'uuid';

import application from '@application';
import { Step, Tag, TYPE_STEP, TYPE_TAG, User } from '@chess-tent/models';

import { generateApiToken, generateCoach } from '../../../application/tests';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Coach should be able to manage created step', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());

  let stepId: string = uuid();
  let coach: User;
  let token: string;

  const stepTemplate = {
    id: stepId,
    type: TYPE_STEP,
    state: {},
  } as Step;

  const createStep = async (): Promise<Step | null> => {
    const { getStep } = await import('../service');

    const newStep = { ...stepTemplate, id: uuid() };
    await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/step/save')
      .set('Cookie', [`token=${token}`])
      .set('Accept', 'application/json')
      .send(newStep)
      .expect(200);

    return await getStep(newStep.id);
  };

  it('should create new step', async function () {
    const { getStep } = await import('../service');
    coach = await generateCoach();
    token = generateApiToken(coach);

    await request(application.service.router)
      .post(process.env.API_BASE_PATH + '/step/save')
      .set('Cookie', [`token=${token}`])
      .set('Accept', 'application/json')
      .send(stepTemplate)
      .expect(200);

    const step = await getStep(stepId);

    expect(step).toEqual({ ...stepTemplate, tags: expect.any(Array), v: 1 });
  });

  it('should be able to get step', async function () {
    const response = await request(application.service.router)
      .get(process.env.API_BASE_PATH + `/step/${stepId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`])
      .expect(200);

    expect(response.body.data.id).toEqual(stepId);
    expect(response.body.data.tags).toEqual([]);
    expect(response.body.data.type).toEqual(TYPE_STEP);
    expect(response.body.data.state).toEqual({});
  });

  const beginnerTag: Tag = {
    id: uuid(),
    text: 'Beginner',
    type: TYPE_TAG,
  } as Tag;

  it('should be able to update step tags', async function () {
    const { getStep } = await import('../service');

    await application.service.addTag(beginnerTag);

    await request(application.service.router)
      .put(process.env.API_BASE_PATH + `/step/${stepId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`])
      .send({ tags: [beginnerTag] })
      .expect(200);

    const step = await getStep(stepId);
    expect(step).toEqual({
      ...stepTemplate,
      tags: [{ ...beginnerTag, v: 0 }],
      v: 1,
    });
  });

  it('should be able to list all steps', async function () {
    const { getStep } = await import('../service');

    const step2 = await createStep();
    const response = await request(application.service.router)
      .post(process.env.API_BASE_PATH + `/steps`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`])
      .expect(200);

    expect(response.body.data.length).toBe(2);
    const step = await getStep(stepId);
    expect(response.body.data).toEqual([step, step2]);
  });

  it('should be able to filter steps by tag', async function () {
    const { getStep } = await import('../service');

    const response = await request(application.service.router)
      .post(process.env.API_BASE_PATH + `/steps`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`])
      .send({ tagIds: [beginnerTag.id] })
      .expect(200);

    expect(response.body.data.length).toBe(1);
    const step = await getStep(stepId);
    expect(response.body.data).toEqual([step]);
  });

  it('should be able to delete step', async function () {
    const { getStep } = await import('../service');

    await request(application.service.router)
      .delete(process.env.API_BASE_PATH + `/step/${stepId}`)
      .set('Accept', 'application/json')
      .set('Cookie', [`token=${token}`])
      .expect(200);

    const step = await getStep(stepId);
    expect(step).toBe(null);
  });
});

describe('GET /step/:stepId', () => {
  beforeAll(() => application.test.start());
  afterAll(() => application.stop());
  it('should return forbidden status', async () => {
    await request(application.service.router)
      .get(process.env.API_BASE_PATH + '/step/812376819764')
      .set('Accept', 'application/json')
      .expect(401);

    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
