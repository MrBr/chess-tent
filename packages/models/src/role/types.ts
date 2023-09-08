import { User } from '../user';
import { TYPE_STEP } from '../step';
import { TYPE_CHAPTER } from '../chapter';
import { TYPE_LESSON } from '../lesson';
import { array } from 'yup';
import { TYPE_ACTIVITY } from '../activity';

export interface Role<T> {
  user: User;
  role: T;
}

export interface NormalizedRole<T> {
  user: User['id'];
  role: T;
}

export const RolePrivileges = {
  Subject: {
    Viewer: ['clone', 'import'],
    Editor: [
      // inherits actions that Viewer can do
      'updateContent',
      // this.Viewer ... <-- would be cool if we could do smth like this todo
    ],
    Owner: ['editPermissions', 'deleteSubject'],
  },
  Activity: {
    Participator: ['participate'],
    Moderator: ['editSubject', 'editActivity', 'editParticipants'],
    Owner: [
      'editPermissions',
      'deleteActivity',
      'cloneActivity',
      'exportSubjects',
    ],
  },
  UserGroup: {
    Member: [
      'exitGroup', // do we need such permission?
      // 'inheritsPermissionsOfTheUserGroup' <-- goes without explicit check but needs different implementation todo
    ],
    Viewer: ['viewGroupMembers'],
    Admin: [
      'editNonAdminGroupMembers',
      'canAddMembersByInvite',
      'canEditMembers',
      'canEditViewers',
    ],
    Owner: ['deleteGroup', 'editAdmins', 'editOwners'], // we might need rule a that we can't leave group owner-less
  },
};

export const generalizeObjectType = (
  objectType: string,
): 'Subject' | 'Activity' => {
  switch (objectType) {
    case TYPE_STEP:
    case TYPE_CHAPTER:
    case TYPE_LESSON:
      return 'Subject';
    case TYPE_ACTIVITY:
      return 'Activity';
    // case TYPE_USER_GROUP:
    //   return JSON.stringify(RolePrivileges.UserGroup);
    default:
      throw new Error(
        'Unable to find RolePrivileges definition of object type for ' +
          objectType,
      );
  }
};
