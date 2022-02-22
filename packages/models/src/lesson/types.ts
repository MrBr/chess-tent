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

export type LessonActivityBoardState = {
  id: string;
  position?: string; // TODO - should be FEN
  shapes?: any[]; // TODO - should be shapes type
  completedSteps?: string[];
  completed?: boolean;
  activeChapterId?: Chapter['id'];
  activeStepId?: Step['id'];
  [key: string]: any;
};

export type LessonActivity = Activity<
  Lesson,
  {
    // LessonActivityBoardState could potentially be normalized and stored as a document itself.
    // That would lead to much more complex (and granular) permissions. For now the permissions are defined on the activity level.
    // All the information is public, everyone can see/edit everything, but the "implementation" may restrict some things for some users through the UI.
    // This also means that there is a single socket channel (room) for the activity. Normalized and more granular LessonActivityBoardState would lead to multiple channels for a single activity.
    presentedBoardId?: string;
    mainBoard: LessonActivityBoardState; // In current implementation reachable by all users
    userBoards: { [key: string]: LessonActivityBoardState }; // In current implementation reachable by the user and the activity coach
  }
>;
