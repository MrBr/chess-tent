import { User } from '../user';
import { Subject } from '../subject';
import { LessonDetails, NormalizedLessonDetails } from '../lessonDetails';
import { Tag } from '../tag';

export const TYPE_LESSON = 'lessons';

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface Lesson extends Subject {
  id: string;
  owner: User;
  type: typeof TYPE_LESSON;
  difficulty: Difficulty;
  tags?: Tag[];
  users?: User[];
  published?: boolean;
  state: LessonDetails;
  versions: LessonDetails[];
}

export interface NormalizedLesson {
  id: Lesson['id'];
  type: Lesson['type'];
  owner: User['id'];
  difficulty: Lesson['difficulty'];
  tags?: Tag['id'][];
  published?: boolean;
  users?: User['id'][];
  state: NormalizedLessonDetails;
  versions: NormalizedLessonDetails[];
}
