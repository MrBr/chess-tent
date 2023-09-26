import { MiddlewareFunction, MiddlewareGetter } from '@types';
import { hasPermissionToDoService } from './service';
import { ForbiddenError } from './errors';
import { ActionValues, ObjectTypeValues } from '@chess-tent/models/src';

export const hasPermissionsMiddleware =
  <T extends { id: string; type: ObjectTypeValues }>(
    getEntity: MiddlewareGetter<T>,
    action: ActionValues,
    userLocalKey: string = 'me',
  ): MiddlewareFunction =>
  async (req, res, next) => {
    const user = res.locals[userLocalKey];
    const entity = getEntity(req, res);
    const hasPermissions = await hasPermissionToDoService(user, entity, action);

    if (!hasPermissions) {
      throw new ForbiddenError(user.id, action, entity.type, entity.id);
    }
    next();
  };
