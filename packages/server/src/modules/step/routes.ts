import application, { middleware } from '@application';
import {
  canEditStep,
  getStep,
  saveStep,
  publishStep,
  findSteps,
  patchStep,
  canAccessStep,
  unpublishStep,
  deleteStep,
} from './middleware';

const { identify, sendData, sendStatusOk, toLocals } = middleware;

application.service.registerPostRoute(
  '/step/save',
  identify,
  toLocals('step', req => req.body),
  canEditStep,
  saveStep,
  sendStatusOk,
);

application.service.registerDeleteRoute(
  '/step/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  canEditStep,
  deleteStep,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/step/publish/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  canEditStep,
  publishStep,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/step/unpublish/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  canEditStep,
  unpublishStep,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/step/:stepId',
  identify,
  toLocals('step', req => req.body),
  toLocals('step.id', req => req.params.stepId),
  canEditStep,
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
  canAccessStep,
  sendData('step'),
);
