import { TYPE_STEP } from '../step';
import { TYPE_CHAPTER } from '../chapter';
import { TYPE_LESSON } from '../lesson';
import { TYPE_ACTIVITY } from '../activity';

const SubjectViewerPrivileges = ['clone', 'import'];
const SubjectEditorPrivileges = [...SubjectViewerPrivileges, 'updateContent'];
const SubjectOwnerPrivileges = [
  ...SubjectEditorPrivileges,
  'editPermissions',
  'deleteSubject',
];
const ActivityParticipatorPrivileges = ['participate'];
const ActivityModeratorPrivileges = [
  ...ActivityParticipatorPrivileges,
  'editSubject',
  'editActivity',
  'editParticipants',
];
const ActivityOwnerPermissions = [
  ...ActivityModeratorPrivileges,
  'editPermissions',
  'deleteActivity',
  'cloneActivity',
  'exportSubjects',
];

const UserGroupMembersPermissions = [
  'exitGroup', // do we need such permission?
  // 'inheritsPermissionsOfTheUserGroup' <-- goes without explicit check but needs different implementation todo
];
const UserGroupViewerPermissions = [
  ...UserGroupMembersPermissions,
  'viewGroupMembers',
];
const UserGroupAdminPermissions = [
  ...UserGroupViewerPermissions,
  'editNonAdminGroupMembers',
  'canAddMembersByInvite',
  'canEditMembers',
  'canEditViewers',
];
const UserGroupOwnerPermissions = [
  ...UserGroupAdminPermissions,
  'deleteGroup',
  'editAdmins',
  'editOwners',
];

type RolePrivileges = {
  [category: string]: {
    [role: string]: string[];
  };
};
export const rolePrivileges: RolePrivileges = {
  Subject: {
    Viewer: SubjectViewerPrivileges,
    Editor: SubjectEditorPrivileges,
    Owner: SubjectOwnerPrivileges,
  },
  Activity: {
    Participator: ActivityParticipatorPrivileges,
    Moderator: ActivityModeratorPrivileges,
    Owner: ActivityOwnerPermissions,
  },
  UserGroup: {
    Member: UserGroupMembersPermissions,
    Viewer: UserGroupViewerPermissions,
    Admin: UserGroupAdminPermissions,
    Owner: UserGroupOwnerPermissions, // we might need rule a that we can't leave group owner-less (or cover it with business logic rather)
  },
};

const getRoleDefinitionsByObjectType = (objectType: String): any => {
  switch (objectType) {
    case TYPE_STEP:
    case TYPE_CHAPTER:
    case TYPE_LESSON:
      return rolePrivileges.Subject;
    case TYPE_ACTIVITY:
      return rolePrivileges.Activity;
    // case TYPE_USER_GROUP:
    //   return rolePrivileges.UserGroup;
    default:
      throw new Error(
        'Unable to find RolePrivileges definition of object type for ' +
          objectType,
      );
  }
};

export const hasPermissions = (
  roles: string[],
  objectType: string,
  action: string,
): boolean => {
  const objectTypeRoleDefinitions = getRoleDefinitionsByObjectType(objectType);
  return roles.some(role => objectTypeRoleDefinitions[role]?.includes(action));
};
