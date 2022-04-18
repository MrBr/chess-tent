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
  difficulty?: Difficulty;
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
  id: string; // Id is here to make board is autonomous (editable by itself)
  position?: string; // TODO - should be FEN
  shapes?: any[]; // TODO - should be shapes type
  completedSteps?: string[];
  completed?: boolean;
  activeChapterId?: Chapter['id'];
  activeStepId: Step['id'];
  [key: string]: any;
};

export type LessonActivityUserSettings = {
  /**
   * Currently previewed board by the user
   * If there isn't select board, activity MAIN board is presented.
   */
  selectedBoardId?: string;
  /**
   * User own board in case of a group mode
   * TODO
   */
  boardId?: string; // User's own board
};

export type LessonActivity = Activity<
  Lesson,
  {
    // LessonActivityBoardState could potentially be normalized and stored as a document itself.
    // That would lead to much more complex (and granular) permissions. For now the permissions are defined on the activity level.
    // All the information is public, everyone can see/edit everything, but the "implementation" may restrict some things for some users through the UI.
    // This also means that there is a single socket channel (room) for the activity. Normalized and more granular LessonActivityBoardState would lead to multiple channels for a single activity.
    mainBoardId: string; // In current implementation reachable by all users
    boards: { [key: string]: LessonActivityBoardState }; // Used in group mode
    userSettings: { [key: string]: LessonActivityUserSettings }; // Specific user settings - use for information that should potentially be visible to others
  }
>;

export enum LessonActivityRole {
  OWNER = 'OWNER',
  COACH = 'COACH',
  STUDENT = 'STUDENT',
}
