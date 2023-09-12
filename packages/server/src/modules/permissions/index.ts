import application from '@application';
import {
  addPermissionService,
  getUsersWithRoleService,
  hasPermissionToDoService,
} from './service';

application.service.addPermission = addPermissionService;
application.service.hasPermissionToDo = hasPermissionToDoService;
application.service.getUsersWithRole = getUsersWithRoleService;
