import { TYPE_USER, User } from '../user';
import { Step, TYPE_STEP } from '../step';
import { Lesson, TYPE_LESSON } from '../lesson';
import { Activity, TYPE_ACTIVITY } from '../activity';
import { Chapter, TYPE_CHAPTER } from '../chapter';

export const TYPE_PERMISSION = 'permissions';

// permission answers a question "what is user's role for a given object?"
export interface Permission {
    id: string,
    type: typeof TYPE_PERMISSION,
    holder: User, // | UserGroup
    holderType: typeof TYPE_USER, // | typeof TYPE_USER_GROUP
    role: string, // operation - we should specify list of ro
    object: Step | Chapter | Lesson | Activity, // | UserGroup
    objectType: typeof TYPE_STEP | typeof TYPE_CHAPTER | typeof TYPE_LESSON | typeof TYPE_ACTIVITY  // | typeof TYPE_USER_GROUP
}

export interface NormalizedPermission {
    id: Permission['id'],
    type: Permission['type'],
    holder: User['id'], // | UserGroup['id']
    holderType: Permission['holderType'],
    role: Permission['role'],
    object: Step['id'] | Chapter['id'] | Lesson['id'] | Activity['id'],
    objectType: Permission['objectType'],
}