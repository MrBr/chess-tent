import application from '@application';
import {
  addPermissionService,
  getUserObjectsByActionService,
  getUserObjectsByRoleService,
  getUsersWithRoleService,
  hasPermissionToDoService,
} from './service';
import { hasPermissionsMiddleware } from './middleware';

application.service.addPermission = addPermissionService;
application.service.hasPermissionToDo = hasPermissionToDoService;
application.service.getUsersWithRole = getUsersWithRoleService;
application.service.getUserObjectsByAction = getUserObjectsByActionService;
application.service.getUserObjectsByRole = getUserObjectsByRoleService;
application.middleware.validatePermissions = hasPermissionsMiddleware;
