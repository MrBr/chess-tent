// Hooks
import {
  LessonsRequest,
  RecordType,
  RecordValue,
  RequestFetch,
  StatusResponse,
} from '@chess-tent/types';
import { ReactElement } from 'react';
import {
  Lesson,
  Mentorship,
  Step,
  Tag,
  User,
  Notification,
  SubjectPathUpdate,
  Subject,
  ServiceType,
  Entity,
} from '@chess-tent/models';
import { Action as ReduxAction } from 'redux';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { BatchAction } from 'redux-batched-actions';
import { useParams, useLocation } from 'react-router-dom';
import { History } from 'history';
import { LessonActivity } from './activity';
import { GenericArguments } from './_helpers';

export type NonNullableRecordReturn<
  T extends RecordValue,
  R extends RecordHookReturn<any> = RecordHookReturn<T>
> = [T, R[1], R[2], R[3]];

export type RecordHookReturn<T extends RecordValue> = [
  T | null,
  (value: T, meta?: Partial<{}>) => void,
  () => void,
  RecordType['meta'],
];

export type CollectionRecordHookReturn<T extends Entity> = [
  T[] | null,
  (value: T[], meta?: Partial<{}>) => void,
  (value: T) => void,
  () => void,
  RecordType['meta'],
];

export type Hooks = {
  useIsMobile: () => boolean;
  useComponentStateSilent: () => { mounted: boolean };
  useComponentState: () => { mounted: boolean };
  usePromptModal: () => (
    renderModal: (close: () => void) => ReactElement,
  ) => void;
  useUpdateLessonStepState: <T extends Step>(
    updateStep: (step: T) => void,
    step: T,
  ) => (state: Partial<T['state']>) => void;
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useDispatch: typeof useDispatch;
  useSelector: typeof useSelector;
  useStore: typeof useStore;
  useDiffUpdates: (
    subject: Subject,
    save: (updates: SubjectPathUpdate[]) => void,
    delay?: number,
  ) => void;
  useTags: () => Tag[];
  useUser: (userId: User['id']) => User;
  useActiveUserRecord: () => NonNullableRecordReturn<User>;
  useActiveUserNotifications: (
    limit?: number,
  ) => RecordHookReturn<Notification[]>;
  useUserTrainings: (user: User) => CollectionRecordHookReturn<LessonActivity>;
  useUserLessonsRecord: (user: User) => RecordHookReturn<Lesson[]>;
  useConversationParticipant: () => RecordHookReturn<User>;
  useHistory: () => History;
  useQuery: <T extends Record<string, string | undefined>>() => T;
  useLocation: typeof useLocation;
  useParams: typeof useParams;
  useApi: <T, K extends StatusResponse>(
    request: RequestFetch<T, K>,
  ) => {
    fetch: (...args: GenericArguments<T>) => void;
    response: K | null;
    loading: boolean;
    error: null | string | {};
    reset: () => void;
  };
  useRecord: <T extends RecordValue>(
    recordKey: string,
    type: RecordType['meta']['type'],
    initialMeta?: RecordType['meta'],
  ) => RecordHookReturn<T>;
  useCollectionRecord: <T extends Entity>(
    recordKey: string,
    type: RecordType['meta']['type'],
    initialMeta?: RecordType['meta'],
  ) => CollectionRecordHookReturn<T>;
  useMeta: <T>(metaKey: string) => [T, (meta: T) => void, () => void];
  useCopyStep: () => [
    boolean,
    (meta: Step) => void,
    () => Step | null,
    () => void,
  ];
  useLessons: (
    key: string,
    filters: LessonsRequest,
    options?: { my?: boolean },
  ) => RecordHookReturn<Lesson[]>;
  useCoaches: (user: User) => RecordHookReturn<Mentorship[]>;
  useStudents: (user: User) => RecordHookReturn<Mentorship[]>;
  useDenormalize: <T extends RecordValue>(
    descriptor: string[] | string | null,
    type?: string,
  ) => T | null;
  useDispatchService: () => <T extends (...args: any) => any>(
    service: T extends ServiceType ? T : never,
  ) => (...payload: T extends (...args: infer U) => any ? U : never) => void;
};
