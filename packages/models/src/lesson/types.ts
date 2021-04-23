import { User } from '../user';
import { Subject } from '../subject';
import { Chapter } from '../chapter';
import { Tag } from '../tag';

export const TYPE_LESSON = 'lessons';

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum LessonStateStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export interface Lesson extends Subject {
  id: string;
  owner: User;
  type: typeof TYPE_LESSON;
  difficulty: Difficulty;
  tags?: Tag[];
  users?: User[];
  published?: boolean;
  state: LessonState;
  versions: LessonState[];
}

export interface NormalizedLesson {
  id: Lesson['id'];
  type: Lesson['type'];
  owner: User['id'];
  difficulty: Lesson['difficulty'];
  tags?: Tag['id'][];
  published?: boolean;
  users?: User['id'][];
  state: NormalizedLessonState;
  versions: NormalizedLessonState[];
}

export interface LessonState {
  chapters: Chapter[];
  title: string;
  description?: string;
  status?: LessonStateStatus;
}

export interface NormalizedLessonState {
  chapters: Chapter[];
  title: LessonState['title'];
  description?: LessonState['description'];
  status?: LessonState['status'];
}
