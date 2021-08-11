// Hooks
import {
  LessonsRequest,
  RequestFetch,
  StatusResponse,
} from '@chess-tent/types';
import { ReactElement } from 'react';
import {
  Step,
  Tag,
  User,
  SubjectPathUpdate,
  Subject,
  ServiceType,
  Activity,
  Lesson,
} from '@chess-tent/models';
import { useRecordInit, useRecordSafe } from '@chess-tent/redux-record';
import { Action as ReduxAction } from 'redux';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { BatchAction } from 'redux-batched-actions';
import { useParams, useLocation } from 'react-router-dom';
import { History } from 'history';
import {
  InferInitRecord,
  RecordHookInit,
  RecordHookSafe,
} from '@chess-tent/redux-record/types';

import { GenericArguments } from './_helpers';
import { Records } from './records';

export type Hooks = {
  useRecordInit: typeof useRecordInit;
  useRecordSafe: typeof useRecordSafe;
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
  useSocketSubscribe: (channel: string | null) => void;
  useDiffUpdates: (
    subject: Subject,
    save: (updates: SubjectPathUpdate[]) => void,
    delay?: number,
  ) => void;
  useTags: () => Tag[];
  useUser: (userId: User['id']) => User;
  useActiveUserRecord: <T = void>(
    fallback?: T,
  ) => RecordHookSafe<InferInitRecord<Records['activeUser']>, T>;
  useConversationParticipant: () => RecordHookInit<
    InferInitRecord<Records['conversationParticipant']>
  >;
  useActiveUserNotifications: (
    limit?: number,
  ) => RecordHookInit<InferInitRecord<Records['activeUserNotifications']>>;
  useUserTrainings: (
    user: User,
  ) => RecordHookInit<InferInitRecord<Records['userTrainings']>>;
  useUserLessonsRecord: (
    user: User,
  ) => RecordHookInit<InferInitRecord<Records['lessons']>>;
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
  useMeta: <T>(metaKey: string) => [T, (meta: T) => void, () => void];
  useCopyStep: () => [
    boolean,
    (meta: Step) => void,
    () => Step | null,
    () => void,
  ];
  useLesson: <T extends Activity>(
    lessonId: Lesson['id'],
  ) => RecordHookInit<InferInitRecord<Records<T>['lesson']>>;
  useActivity: <T extends Activity>(
    key: string,
  ) => RecordHookInit<InferInitRecord<Records<T>['activity']>>;
  useLessons: (
    key: string,
    filters: LessonsRequest,
  ) => RecordHookInit<InferInitRecord<Records['lessons']>>;
  useMyLessons: (
    key: string,
    filters: LessonsRequest,
  ) => RecordHookInit<InferInitRecord<Records['activeUserLessons']>>;
  useCoaches: (
    user: User,
  ) => RecordHookInit<InferInitRecord<Records['coaches']>>;
  useStudents: (
    user: User,
  ) => RecordHookInit<InferInitRecord<Records['students']>>;
  useDispatchService: () => <T extends (...args: any) => any>(
    service: T extends ServiceType ? T : never,
  ) => (...payload: T extends (...args: infer U) => any ? U : never) => void;
};
