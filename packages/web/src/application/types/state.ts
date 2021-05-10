import {
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
  Reducer,
  Store,
} from 'redux';
import {
  Activity,
  Conversation,
  Entity,
  Lesson,
  Message,
  ServiceType,
  Subject,
  User,
} from '@chess-tent/models';
import {
  AppState,
  EntitiesState,
  EntityState,
  RecordMeta,
  RecordType,
  RecordUpdateAction,
  RecordUpdateValueAction,
  RecordValue,
  SendMessageAction,
  UpdateEntitiesAction,
  UpdateEntityAction,
} from '@chess-tent/types';

export type Middleware = ReduxMiddleware;

export type State = {
  store: Store;
  middleware: Middleware[];
  registerReducer: <T, U extends ReduxAction>(
    path: string,
    reducer: Reducer<T, U>,
  ) => void;
  registerEntityReducer: <
    T extends keyof EntitiesState,
    S,
    U extends ReduxAction
  >(
    path: T,
    reducer?: Reducer<S, U>,
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
    updateEntity: (entity: Entity) => UpdateEntityAction;
    serviceAction: <T extends (...args: any) => any>(
      service: T extends ServiceType ? T : never,
    ) => (
      ...payload: T extends (...args: infer U) => any ? U : never
    ) => UpdateEntityAction;
    sendMessage: (
      user: User,
      conversation: Conversation,
      message: Message,
    ) => SendMessageAction;
  };
  selectors: {
    lessonSelector: (
      lessonId: Lesson['id'],
    ) => (state: AppState) => Lesson | null;
    activitySelector: <T extends Subject>(
      activityId: Activity<T>['id'],
    ) => (state: AppState) => Activity<T>;
    selectRecord: <T extends RecordValue>(
      recordKey: string,
    ) => (state: AppState) => RecordType<T>;
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
