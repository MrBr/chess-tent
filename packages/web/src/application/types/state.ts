import {
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
  Reducer,
  Store,
} from 'redux';
import {
  Activity,
  Chapter,
  Conversation,
  Entity,
  Lesson,
  Message,
  NormalizedLesson,
  Step,
  Subject,
  User,
  Notification,
} from '@chess-tent/models';
import {
  AddLessonChapterAction,
  AppState,
  SendMessageAction,
  SetActivityActiveStepAction,
  UpdateActivityAction,
  UpdateActivityStateAction,
  UpdateEntitiesAction,
  UpdateLessonAction,
  UpdateLessonChapterAction,
  UpdateLessonPathAction,
  UpdateLessonStepAction,
  UpdateNotificationAction,
} from '@chess-tent/types';

export type Middleware = ReduxMiddleware;

export type State = {
  store: Store;
  middleware: Middleware[];
  registerReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerEntityReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerMiddleware: (middleware: Middleware) => void;
  getRootReducer: () => Reducer;
  actions: {
    updateEntities: (entity: Entity | Entity[]) => UpdateEntitiesAction;
    updateLesson: (
      lesson: Lesson,
      patch:
        | Partial<Omit<Lesson, 'state'>>
        | { state: Partial<Lesson['state']> },
    ) => UpdateLessonAction;
    updateNotification: (
      notification: Notification,
    ) => UpdateNotificationAction;
    updateActivityState: <T extends Activity>(
      activity: T,
      state: Partial<T extends Activity<infer K, infer S> ? S : never>,
    ) => UpdateActivityStateAction;
    setActivityActiveStep: (
      activity: Activity,
      step: Step,
    ) => SetActivityActiveStepAction;
    updateActivity: <T extends Activity>(
      activity: T,
      patch: Partial<T>,
    ) => UpdateActivityAction<T extends Activity<infer S> ? S : never>;
    sendMessage: (
      user: User,
      conversation: Conversation,
      message: Message,
    ) => SendMessageAction;
    updateLessonStep: <T extends Step>(
      lesson: Lesson,
      chapter: Chapter,
      step: T,
    ) => UpdateLessonStepAction;
    addLessonChapter: (
      lesson: Lesson,
      chapter: Chapter,
    ) => AddLessonChapterAction;
    updateLessonChapter: (
      lesson: Lesson,
      chapter: Chapter,
    ) => UpdateLessonChapterAction;
    updateLessonPath: <
      T extends keyof NormalizedLesson,
      K extends keyof NormalizedLesson['state']
    >(
      lesson: Lesson,
      path: T extends 'state' ? [T, K] : [T],
      value: T extends 'state' ? NormalizedLesson[T][K] : NormalizedLesson[T],
    ) => UpdateLessonPathAction;
    // TODO - not implemented - requires some refactoring, but useful for atomic updates
    updateLessonStepState: <
      T extends Step,
      K extends keyof T['state'],
      U extends keyof T['state'][K],
      S extends keyof T['state'][K][U]
    >(
      lesson: Lesson,
      chapter: Chapter,
      step: T,
      path: [K] | [K, U] | [K, U, S],
      value: T['state'][K] extends {}
        ? T['state'][K][U] extends {}
          ? T['state'][K][U][S]
          : T['state'][K][U]
        : T['state'][K],
    ) => void;
  };
  selectors: {
    lessonSelector: (
      lessonId: Lesson['id'],
    ) => (state: AppState) => Lesson | null;
    activitySelector: <T extends Subject>(
      activityId: Activity<T>['id'],
    ) => (state: AppState) => Activity<T>;
  };
};
