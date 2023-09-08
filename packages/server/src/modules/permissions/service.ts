import {
  Activity,
  Chapter,
  generalizeObjectType,
  Lesson,
  Permission,
  RolePrivileges,
  Step,
  TYPE_PERMISSION,
  User,
} from '@chess-tent/models/src';
import { DepopulatedPermission, PermissionModel } from './model';
import { v4 as uuid } from 'uuid';
import { FilterQuery } from 'mongoose';
import { AppDocument } from '@types';
import { DepopulatedStep, StepModel } from '../step/model';
import _ from 'lodash';

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

export const getPermissions = async (
  object: Step | Chapter | Lesson | Activity,
  action: string,
  holder: User,
): Promise<boolean> => {
  const query: FilterQuery<AppDocument<DepopulatedPermission>> = {
    object: object.id,
    objectType: object.type,
    holder: holder.id,
    holderType: holder.type,
  };
  const permissions = await PermissionModel.find(query).lean().exec();
  const roles = permissions.map(item => item.role);

  const objectType = generalizeObjectType(object.type);

  let found = false;
  roles.forEach((role: string) => {
    if (RolePrivileges[objectType][role]?.includes(action)) {
      found = true;
      return;
    }
  });

  return found;
};
