import {
  Action as ReduxAction,
  Middleware as ReduxMiddleware,
  Reducer,
  Store as ReduxStore,
} from 'redux';
import {
  Activity,
  Conversation,
  Entity,
  Lesson,
  Message,
  ReversiblePatch,
  ServiceType,
  Subject,
  User,
} from '@chess-tent/models';
import {
  Actions,
  AppState,
  DeleteEntityAction,
  EntitiesState,
  EntityState,
  ResetStateAction,
  SendMessageAction,
  SendPatchAction,
  UpdateEntitiesAction,
  UpdateEntityAction,
} from '@chess-tent/types';
import {
  RecordConcatAction,
  RecordPushAction,
  RecordUpdateAction,
} from '@chess-tent/redux-record/types';

export type Middleware = ReduxMiddleware;

export type Store = ReduxStore;

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
    U extends ReduxAction,
  >(
    path: T,
    reducer?: Reducer<S, U>,
  ) => void;
  registerMiddleware: (middleware: Middleware) => void;
  getRootReducer: () => Reducer<AppState, Actions>;
  actions: {
    updateRecord: <T, M extends {}>(
      recordKey: string,
      value: T,
      meta?: M,
    ) => RecordUpdateAction<T, M>;
    pushRecord: <T, M extends {}>(
      recordKey: string,
      value: T,
      meta?: M,
    ) => RecordPushAction<T, M>;
    concatRecord: <T, M extends {}>(
      recordKey: string,
      value: T[],
      meta?: M,
    ) => RecordConcatAction<T, M>;

    resetState: () => ResetStateAction;
    updateEntities: (entity: Entity | Entity[]) => UpdateEntitiesAction;
    updateEntity: <M extends {}>(
      entity: Entity,
      meta?: M,
    ) => UpdateEntityAction;
    deleteEntity: (entity: Entity) => DeleteEntityAction;
    serviceAction: <T extends (...args: any) => any>(
      service: T extends ServiceType ? T : never,
    ) => (
      ...payload: T extends (...args: infer U) => any ? U : never
    ) => UpdateEntityAction;
    sendPatchAction: (
      reversiblePatch: ReversiblePatch,
      id: string,
      type: string,
    ) => SendPatchAction;
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
    selectNormalizedEntities: <
      T extends string | string[],
      K extends keyof EntitiesState,
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
