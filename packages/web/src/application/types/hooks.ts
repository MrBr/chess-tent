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
} from '@chess-tent/models';
import { Action as ReduxAction } from 'redux';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { BatchAction } from 'redux-batched-actions';
import { useParams, useLocation } from 'react-router-dom';
import { History } from 'history';
import { LessonActivity } from './activity';
import { GenericArguments } from './_helpers';

export type RecordHookReturn<T extends RecordValue> = [
  T | null,
  (value: T, meta?: {}) => void,
  () => void,
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
  useActiveUserRecord: () => RecordHookReturn<User>;
  useActiveUserNotifications: () => RecordHookReturn<Notification[]>;
  useUserTrainings: (user: User) => RecordHookReturn<LessonActivity[]>;
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
  ) => RecordHookReturn<T>;
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
