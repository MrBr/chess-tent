import { User } from '../user';
import { Subject } from '../subject';
import { Chapter } from '../chapter';
import { Tag } from '../tag';
import { Step } from '../step';
import { Activity } from '../activity';

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
  docId?: string;
  owner: User;
  type: typeof TYPE_LESSON;
  difficulty: Difficulty;
  tags?: Tag[];
  users?: User[];
  published?: boolean;
  state: {
    chapters: Chapter[];
    title: string;
    description?: string;
    status?: LessonStateStatus;
  };
}

export interface NormalizedLesson {
  id: Lesson['id'];
  docId?: Lesson['id'];
  type: Lesson['type'];
  owner: User['id'];
  difficulty: Lesson['difficulty'];
  tags?: Tag['id'][];
  published?: boolean;
  users?: User['id'][];
  state: {
    chapters: Chapter[];
    title: Lesson['state']['title'];
    description?: Lesson['state']['description'];
    status?: Lesson['state']['status'];
  };
}

export type LessonActivity = Activity<
  Lesson,
  {
    activeChapterId?: Chapter['id'];
    activeStepId?: Step['id'];
    [key: string]: any;
  }
>;
