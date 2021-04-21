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
  NormalizedActivity,
  SubjectPath,
  LessonDetails,
} from '@chess-tent/models';
import {
  AddLessonChapterAction,
  PublishLessonAction,
  AppState,
  EntitiesState,
  EntityState,
  RecordMeta,
  RecordType,
  RecordUpdateAction,
  RecordUpdateValueAction,
  RecordValue,
  SendMessageAction,
  UpdateActivityPropertyAction,
  UpdateActivityStepAction,
  UpdateEntitiesAction,
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
    updateRecord: <T extends RecordValue>(
      recordKey: string,
      entity: T,
      meta?: RecordMeta,
    ) => RecordUpdateAction;
    updateRecordValue: (
      recordKey: string,
      recordValue: RecordType['value'],
      type: RecordMeta['type'],
    ) => RecordUpdateValueAction;
    updateEntities: (entity: Entity | Entity[]) => UpdateEntitiesAction;
    updateNotification: (
      notification: Notification,
    ) => UpdateNotificationAction;
    updateActivityStepState: (
      activity: Activity,
      stepId: Step['id'],
      // TODO - resolve payload type; something like recursive Partial<T extends {}>
      payload: {},
    ) => UpdateActivityStepAction;
    updateActivityStepAnalysis: (
      activity: Activity,
      stepId: Step['id'],
      path: SubjectPath,
      payload: any,
    ) => UpdateActivityStepAction;
    updateActivityProperty: <
      T extends keyof NormalizedActivity,
      K extends keyof NormalizedActivity['state']
    >(
      activity: Activity,
      path: T extends 'state' ? [T, K] : [T],
      value: T extends 'state'
        ? NormalizedActivity[T][K]
        : NormalizedActivity[T],
    ) => UpdateActivityPropertyAction;
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
    publishLesson: (
      lesson: Lesson,
      lessonDetails: LessonDetails,
    ) => PublishLessonAction;
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
    selectRecord: (recordKey: string) => (state: AppState) => RecordType;
    selectNormalizedEntities: <
      T extends string | string[],
      K extends keyof EntitiesState
    >(
      entityDescriptor: T,
      type: keyof EntitiesState,
    ) => (
      state: AppState,
    ) => K extends keyof EntitiesState
      ? EntitiesState[K] extends EntityState<infer U>
        ? T extends []
          ? U[]
          : U
        : never
      : never;
  };
};
