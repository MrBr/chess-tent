import application, { middleware } from '@application';
import {
  getStep,
  saveStep,
  findSteps,
  patchStep,
  deleteStep,
} from './middleware';
import { TYPE_STEP } from '@chess-tent/models';
import { conditional } from '../app/middleware';
import { stepExists } from './service';

const { identify, sendData, sendStatusOk, toLocals, validatePermissions } =
  middleware;

application.service.registerPostRoute(
  '/step/save',
  identify,
  toLocals('step', req => req.body),
  conditional(async (req, res) => {
    return await stepExists(req.body.id);
  })(
    validatePermissions(
      req => ({ id: req.body.id, type: TYPE_STEP }),
      'updateContent',
    ),
  ),
  saveStep,
  sendStatusOk,
);

application.service.registerDeleteRoute(
  '/step/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  validatePermissions(
    req => ({ id: req.params.stepId, type: TYPE_STEP }),
    'deleteSubject',
  ),
  deleteStep,
  sendStatusOk,
);

application.service.registerPutRoute(
  '/step/:stepId',
  identify,
  toLocals('step', req => req.body),
  toLocals('step.id', req => req.params.stepId),
  validatePermissions(
    req => ({ id: req.params.stepId, type: TYPE_STEP }),
    'updateContent',
  ),
  patchStep,
  sendStatusOk,
);

application.service.registerPostRoute(
  '/steps',
  identify,
  toLocals('filters', async (req, res) => ({
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    ids: await application.service.getUserObjectsByAction(
      res.locals.me,
      'view',
      TYPE_STEP,
    ),
  })),
  /**
   * todo: here we need to get all steps that user can view
   *
   * 1 - get all IDs of type (step) user can view
   * 2 - filter their IDs
   **/
  findSteps,
  sendData('steps'),
);

application.service.registerPostRoute(
  '/my-steps',
  identify,
  toLocals('filters', async (req, res) => ({
    owner: res.locals.me.id,
    users: [res.locals.me.id],
    search: req.body.search,
    difficulty: req.body.difficulty,
    tagIds: req.body.tagIds,
    hasDocId: false,
    published: req.body.published,
    ids: await application.service.getUserObjectsByRole(
      res.locals.me,
      'Owner',
      TYPE_STEP,
    ),
  })),

  findSteps,
  sendData('steps'),
);

application.service.registerGetRoute(
  '/step/:stepId',
  identify,
  toLocals('step.id', req => req.params.stepId),
  validatePermissions(
    req => ({ id: req.params.stepId, type: TYPE_STEP }),
    'view',
  ),
  getStep,
  sendData('step'),
);
