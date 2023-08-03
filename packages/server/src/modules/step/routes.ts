import application, { middleware } from '@application';
import {
  getStep,
  saveStep,
  findSteps,
  patchStep,
  deleteStep,
} from './middleware';

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  '/step/save',
  identify,
  toLocals('step', req => req.body),
  saveStep,
  sendStatusOk,
);

application.service.registerDeleteRoute(
  '/step/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  deleteStep,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/step/:stepId',
  identify,
  toLocals('step', req => req.body),
  toLocals('step.id', req => req.params.stepId),
  patchStep,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/steps',
  identify,
  toLocals('filters', req => ({
    owner: req.body.owner,
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    hasDocId: true,
    published: true,
  })),
  findSteps,
  sendData('steps'),
);

application.service.registerPostRoute(
  '/my-steps',
  identify,
  toLocals('filters', (req, res) => ({
    owner: res.locals.me.id,
    users: [res.locals.me.id],
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    hasDocId: false,
    published: req.body.published,
  })),
  findSteps,
  sendData('steps'),
);

application.service.registerGetRoute(
  '/step/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  getStep,
  sendData('step'),
);
