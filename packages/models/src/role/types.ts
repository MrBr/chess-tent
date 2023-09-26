import { TYPE_STEP } from '../step';
import { TYPE_CHAPTER } from '../chapter';
import { TYPE_LESSON } from '../lesson';
import { TYPE_ACTIVITY } from '../activity';

export const ObjectTypes = {
  Step: TYPE_STEP,
  Chapter: TYPE_CHAPTER,
  Lesson: TYPE_LESSON,
  Activity: TYPE_ACTIVITY,
  // UserGroup: TYPE_USER_GROUP
} as const;
export type ObjectTypeValues = typeof ObjectTypes[keyof typeof ObjectTypes];

export const ObjectCategories = {
  Subject: 'subject',
  Activity: 'activity',
  UserGroup: 'userGroup',
} as const;

export type ObjectCategoryValues =
  typeof ObjectCategories[keyof typeof ObjectCategories];

export const SubjectActions = {
  View: 'view',
  Clone: 'clone',
  Import: 'import',
  UpdateContent: 'updateContent',
  EditPermissions: 'editPermissions',
  DeleteSubject: 'deleteSubject',
} as const;
export type SubjectActionValues =
  typeof SubjectActions[keyof typeof SubjectActions];

const SubjectViewerPrivileges = [
  SubjectActions.View,
  SubjectActions.Clone,
  SubjectActions.Import,
] as const;
const SubjectEditorPrivileges = [
  ...SubjectViewerPrivileges,
  SubjectActions.UpdateContent,
] as const;
const SubjectOwnerPrivileges = [
  ...SubjectEditorPrivileges,
  SubjectActions.EditPermissions,
  SubjectActions.DeleteSubject,
] as const;

export const ActivityActions = {
  Participate: 'participate',
  EditSubject: 'editSubject',
  EditActivity: 'editActivity',
  EditParticipants: 'editParticipants',
  EditPermissions: 'editPermissions',
  DeleteActivity: 'deleteActivity',
  CloneActivity: 'cloneActivity',
  ExportSubjects: 'exportSubjects',
} as const;
export type ActivityActionValues =
  typeof ActivityActions[keyof typeof ActivityActions];

const ActivityParticipatorPrivileges = [ActivityActions.Participate] as const;
const ActivityModeratorPrivileges = [
  ...ActivityParticipatorPrivileges,
  ActivityActions.EditSubject,
  ActivityActions.EditActivity,
  ActivityActions.EditParticipants,
] as const;
const ActivityOwnerPermissions = [
  ...ActivityModeratorPrivileges,
  ActivityActions.EditPermissions,
  ActivityActions.DeleteActivity,
  ActivityActions.CloneActivity,
  ActivityActions.ExportSubjects,
] as const;

export const UserGroupActions = {
  ExitGroup: 'exitGroup',
  ViewGroupMembers: 'viewGroupMembers',
  EditNonAdminGroupMembers: 'editNonAdminGroupMembers',
  CanAddMembersByInvite: 'canAddMembersByInvite',
  CanEditMembers: 'canEditMembers',
  CanEditViewers: 'canEditViewers',
  DeleteGroup: 'deleteGroup',
  EditAdmins: 'editAdmins',
  EditOwners: 'editOwners',
} as const;
export type UserGroupActionValues =
  typeof UserGroupActions[keyof typeof UserGroupActions];

export type ActionValues =
  | SubjectActionValues
  | ActivityActionValues
  | UserGroupActionValues;

const UserGroupMembersPermissions = [
  UserGroupActions.ExitGroup, // do we need such permission?
  // 'inheritsPermissionsOfTheUserGroup' <-- goes without explicit check but needs different implementation todo
] as const;
const UserGroupViewerPermissions = [
  ...UserGroupMembersPermissions,
  UserGroupActions.ViewGroupMembers,
] as const;
const UserGroupAdminPermissions = [
  ...UserGroupViewerPermissions,
  UserGroupActions.EditNonAdminGroupMembers,
  UserGroupActions.CanAddMembersByInvite,
  UserGroupActions.CanEditMembers,
  UserGroupActions.CanEditViewers,
] as const;
const UserGroupOwnerPermissions = [
  ...UserGroupAdminPermissions,
  UserGroupActions.DeleteGroup,
  UserGroupActions.EditAdmins,
  UserGroupActions.EditOwners,
] as const;

export const SubjectRoles = {
  Viewer: 'viewer',
  Editor: 'editor',
  Owner: 'owner',
} as const;
export type SubjectRoleValues = typeof SubjectRoles[keyof typeof SubjectRoles];

export const ActivityRoles = {
  Participator: 'participator',
  Moderator: 'moderator',
  Owner: 'owner',
} as const;
export type ActivityRoleValues =
  typeof ActivityRoles[keyof typeof ActivityRoles];

export const UserGroupRoles = {
  Member: 'member',
  Viewer: 'viewer',
  Admin: 'admin',
  Owner: 'owner',
} as const;
export type UserGroupRoleValues =
  typeof UserGroupRoles[keyof typeof UserGroupRoles];

export type RoleValues =
  | SubjectRoleValues
  | ActivityRoleValues
  | UserGroupRoleValues;

type CategoryRolePrivileges = {
  [category in ObjectCategoryValues]: {
    [role in RoleValues]: ActionValues[];
  };
};

type RolePrivileges = { [role in RoleValues]: ActionValues[] };
export const categoryRolePrivileges: CategoryRolePrivileges = {
  [ObjectCategories.Subject]: {
    [SubjectRoles.Viewer]: SubjectViewerPrivileges,
    [SubjectRoles.Editor]: SubjectEditorPrivileges,
    [SubjectRoles.Owner]: SubjectOwnerPrivileges,
  },
  [ObjectCategories.Activity]: {
    [ActivityRoles.Participator]: ActivityParticipatorPrivileges,
    [ActivityRoles.Moderator]: ActivityModeratorPrivileges,
    [ActivityRoles.Owner]: ActivityOwnerPermissions,
  },
  [ObjectCategories.UserGroup]: {
    [UserGroupRoles.Member]: UserGroupMembersPermissions,
    [UserGroupRoles.Viewer]: UserGroupViewerPermissions,
    [UserGroupRoles.Admin]: UserGroupAdminPermissions,
    [UserGroupRoles.Owner]: UserGroupOwnerPermissions, // we might need rule a that we can't leave group owner-less (or cover it with business logic rather)
  },
} as const;

const getRoleDefinitionsByObjectType = (
  objectType: ObjectTypeValues,
): RolePrivileges => {
  switch (objectType) {
    case ObjectTypes.Step:
    case ObjectTypes.Chapter:
    case ObjectTypes.Lesson:
      return categoryRolePrivileges[ObjectCategories.Subject];
    case ObjectTypes.Activity:
      return categoryRolePrivileges[ObjectCategories.Activity];
    // case TYPE_USER_GROUP:
    //   return rolePrivileges.UserGroup;
    default:
      throw new Error(
        'Unable to find RolePrivileges definition of object type for ' +
          objectType,
      );
  }
};

export const getRolesWithAction = (
  objectType: ObjectTypeValues,
  action: ActionValues,
): string[] => {
  const roleDefinitions: RolePrivileges =
    getRoleDefinitionsByObjectType(objectType);
  return Object.keys(roleDefinitions)
    .map((role: string) => role as RoleValues)
    .filter((role: RoleValues) => roleDefinitions[role].includes(action));
};
export const hasPermissions = (
  roles: RoleValues[],
  objectType: ObjectTypeValues,
  action: ActionValues,
): boolean => {
  const objectTypeRoleDefinitions = getRoleDefinitionsByObjectType(objectType);
  return roles.some(role => objectTypeRoleDefinitions[role]?.includes(action));
};
