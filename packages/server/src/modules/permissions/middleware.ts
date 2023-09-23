import { MiddlewareFunction, MiddlewareGetter } from '@types';
import { hasPermissionToDoService } from './service';
import { ForbiddenError } from './errors';

export const hasPermissionsMiddleware =
  <T extends { id: string; type: string }>(
    getEntity: MiddlewareGetter<T>,
    action: string,
    userLocalKey: string = 'me',
  ): MiddlewareFunction =>
  async (req, res, next) => {
    console.log('Checking user permissions...');
    const user = res.locals[userLocalKey];
    const entity = getEntity(req, res);
    const hasPermissions = await hasPermissionToDoService(user, entity, action);

    if (!hasPermissions) {
      console.log('User has no permissions');
      throw new ForbiddenError(user.id, action, entity.type, entity.id);
    } else {
      console.log('User has permissions');
    }
  };
