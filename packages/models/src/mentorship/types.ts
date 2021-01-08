import { User } from '../user';

export const TYPE_MENTORSHIP = 'mentorship';

export interface Mentorship {
  student: User;
  coach: User;
  approved?: boolean;
  type: typeof TYPE_MENTORSHIP;
}

export interface NormalizedMentorship {
  student: User['id'];
  coach: User['id'];
  approved?: Mentorship['approved'];
  type: Mentorship['type'];
}
