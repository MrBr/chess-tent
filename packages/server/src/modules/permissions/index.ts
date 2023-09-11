import application from '@application';
import { addPermissionService, hasPermissionToDoService } from './service';

application.service.addPermission = addPermissionService;
application.service.hasPermissionToDo = hasPermissionToDoService;
