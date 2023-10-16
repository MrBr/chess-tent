import {
  ActionValues,
  Activity,
  Chapter,
  getRolesWithAction,
  hasPermissions,
  Lesson,
  ObjectTypeValues,
  RoleValues,
  Step,
  TYPE_PERMISSION,
  TYPE_USER,
  User,
} from '@chess-tent/models/src';
import { DepopulatedPermission, PermissionModel } from './model';
import { v4 as uuid } from 'uuid';
import { FilterQuery } from 'mongoose';
import { AppDocument } from '@types';
import { Permission } from '@chess-tent/models';

export const addPermissionService = async (
  object: Step | Chapter | Lesson | Activity,
  role: string,
  holder: User,
) => {
  await new PermissionModel({
    id: uuid(),
    type: TYPE_PERMISSION,
    holder: holder.id,
    holderType: holder.type,
    role: role,
    object: object.id,
    objectType: object.type,
  } as DepopulatedPermission).save();
};

export const hasPermissionToDoService = async <
  T extends { id: string; type: ObjectTypeValues },
>(
  subject: User,
  object: T,
  predicate: ActionValues,
): Promise<boolean> => {
  const query: FilterQuery<AppDocument<DepopulatedPermission>> = {
    object: object.id,
    objectType: object.type,
    holder: subject.id,
    holderType: subject.type,
  };

  // Once UserGroups are implemented, we'll have to
  // filter permissions with all the userGroups user
  // is assigned to
  const permissions = await PermissionModel.find(query).lean().exec();
  const roles = permissions.map(item => item.role as RoleValues);
  return hasPermissions(roles, object.type, predicate);
};

export const getUsersWithRoleService = async (
  object: Step | Chapter | Lesson | Activity, // | UserGroup
  role: string,
): Promise<Array<User>> => {
  const query: FilterQuery<AppDocument<DepopulatedPermission>> = {
    object: object.id,
    objectType: object.type,
    role: role,
  };

  return (
    await PermissionModel.find(query).populate('permissions.holder').exec()
  ).map(
    depopulatedPermission =>
      depopulatedPermission.toObject<Permission>().holder,
  );
};
export const getUserObjectsByActionService = async (
  user: User,
  action: ActionValues,
  objectType: ObjectTypeValues,
): Promise<string[]> => {
  const roles: string[] = getRolesWithAction(objectType, action);

  const query: FilterQuery<AppDocument<DepopulatedPermission>> = {
    objectType: objectType,
    holderType: TYPE_USER,
    holder: user.id,
    role: { $in: roles },
  };

  return (await PermissionModel.find(query).exec()).map(
    depopulatedPermission =>
      depopulatedPermission.toObject<DepopulatedPermission>().object,
  );
};

export const getUserObjectsByRoleService = async (
  user: User,
  role: string,
  objectType: string,
): Promise<string[]> => {
  const query: FilterQuery<AppDocument<DepopulatedPermission>> = {
    objectType: objectType,
    holderType: TYPE_USER,
    holder: user.id,
    role: role,
  };

  return (await PermissionModel.find(query).exec()).map(
    depopulatedPermission =>
      depopulatedPermission.toObject<DepopulatedPermission>().object,
  );
};