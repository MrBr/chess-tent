import { User } from '../user';
import { Subject } from '../subject';
import { Chapter } from '../chapter';
import { Tag } from '../tag';

export const TYPE_LESSON = 'lessons';
export const TYPE_LESSON_DETAILS = 'lessonDetails';

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum LessonDetailsStatus {
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

export interface LessonDetails {
  type: typeof TYPE_LESSON_DETAILS;
  chapters: Chapter[];
  title: string;
  description?: string;
  status?: LessonDetailsStatus;
}

export interface NormalizedLessonDetails {
  type: LessonDetails['type'];
  chapters: Chapter[];
  title: LessonDetails['title'];
  description?: LessonDetails['description'];
  status?: LessonDetails['status'];
}
