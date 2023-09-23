import application from '@application';
import {
  addPermissionService,
  getUsersWithRoleService,
  hasPermissionToDoService,
} from './service';
import { hasPermissionsMiddleware } from './middleware';

application.service.addPermission = addPermissionService;
application.service.hasPermissionToDo = hasPermissionToDoService;
application.service.getUsersWithRole = getUsersWithRoleService;
application.middleware.validatePermissions = hasPermissionsMiddleware;
