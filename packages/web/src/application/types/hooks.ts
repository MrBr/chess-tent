// Hooks
import {
  Actions,
  AnswerAction,
  GetRequestFetchArgs,
  GetRequestFetchResponse,
  ICECandidateAction,
  LessonsFilters,
  OfferAction,
  RequestFetch,
  ScheduledLessonActivityFilters,
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
  LessonActivity,
  Mentorship,
} from '@chess-tent/models';
import { useRecordInit, useRecordSafe } from '@chess-tent/redux-record';
import { Action as ReduxAction } from 'redux';
import { RefObject } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { BatchAction } from 'redux-batched-actions';
import { useParams } from 'react-router-dom';
import type * as H from 'history';
import {
  RecordHookReturn,
  RecordHookSafe,
  RecordValue,
} from '@chess-tent/redux-record/types';
import { ObjectSchema, ValidationError as YupValidationError } from 'yup';

import { Records } from './records';
import { History, LocationState } from './router';
import { GenericArguments } from './_helpers';
import { ChessboardContext } from './context';
import { Wizard, WizardStep } from './ui';

type UseMetaReturn<T> = [T, (meta: T) => void, () => void];

export interface ConferencingHandlers {
  handleAnswer(data: AnswerAction): void;
  handleICECandidate(data: ICECandidateAction): void;
  handleOffer(data: OfferAction): void;
}

export enum ApiStatus {
  SAVED = 'SAVED',
  ERROR = 'ERROR',
  DIRTY = 'DIRTY',
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  SAVING = 'SAVING',
}

export interface ApiState<T extends RequestFetch<any, any>> {
  fetch: (...args: GenericArguments<GetRequestFetchArgs<T>>) => void;
  response: GetRequestFetchResponse<T> | null;
  loading: boolean;
  error: null | string | {};
  reset: () => void;
}

export type ValidationError = YupValidationError & {
  params: { label?: string };
};

export type Hooks = {
  useValidation: (
    schema: ObjectSchema,
  ) => [ValidationError | null, (state: {}) => boolean];
  useRecordInit: typeof useRecordInit;
  useRecordSafe: typeof useRecordSafe;
  useIsMobile: () => boolean;
  useComponentStateSilent: () => { mounted: boolean };
  useComponentState: () => { mounted: boolean };
  useOutsideClick: (
    outsideClickHandler: () => void,
    ...refs: RefObject<any>[]
  ) => void;
  useSocketActionListener: (
    listener: (action: Actions | string) => void,
  ) => void;
  useInputStateUpdate: (
    delay: number,
    update: (patch: {}) => void,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  usePrompt: (
    render: (close: () => void) => ReactElement,
  ) => [ReactElement | undefined, () => void];
  useWizard: <T extends {}, P extends {}>(
    steps: WizardStep<T, P>[],
    initialState: T,
  ) => Wizard<T, P>;
  useUpdateLessonStepState: <T extends Step>(
    updateStep: (step: T) => void,
    step: T,
  ) => (state: Partial<T['state']>) => void;
  useDispatchBatched: () => (...args: ReduxAction[]) => BatchAction;
  useDispatch: typeof useDispatch;
  useSelector: typeof useSelector;
  useStore: typeof useStore;
  useSocketSubscribe: (channel: string) => void;
  useSocketRoomUsers: (room: string) => User[];
  useDiffUpdates: (
    subject: RecordValue<Subject>,
    save: (updates: SubjectPathUpdate[]) => void,
    delay?: number,
  ) => () => void;
  useTags: () => Tag[];
  useUser: (userId: User['id']) => User;
  useActiveUserRecord: <T = void>(
    fallback?: T,
  ) => RecordHookSafe<Records['activeUser'], T>;
  useOpenConversations: () => [ReactElement | undefined, (user?: User) => void];
  useOpenTraining: () => (lesson: LessonActivity) => void;
  useOpenTemplate: () => (lesson: Lesson) => void;
  useOpenLesson: () => (lesson: Lesson) => void;
  useMentorship: (mentorship: Mentorship) => {
    update: (approved: boolean) => void;
    loading: boolean;
  };
  useActiveUserNotifications: (
    limit?: number,
  ) => RecordHookReturn<Records['activeUserNotifications']>;
  useUserTrainings: (user: User) => RecordHookReturn<Records['userTrainings']>;
  useUserScheduledTrainings: (
    user: User,
    initialFilters?: Partial<ScheduledLessonActivityFilters>,
  ) => RecordHookReturn<Records['userScheduledTrainings']>;
  usePromptNewTrainingModal: () => [ReactElement | undefined, () => void];
  useUserLessonsRecord: (user: User) => RecordHookReturn<Records['lessons']>;
  useHistory: () => History;
  useQuery: <T extends Record<string, string | undefined>>() => T;
  useLocation(): H.Location<LocationState>;
  useParams: typeof useParams;
  useApi: <T extends RequestFetch<any, any>>(request: T) => ApiState<T>;
  useApiStatus: <T extends RequestFetch<any, any>>(
    subject: RecordValue<Subject>,
    apiState: ApiState<T>,
  ) => [ApiStatus, (status: ApiStatus) => void];
  useMeta: <T>(metaKey: string, defaultValue?: T) => UseMetaReturn<T>;
  useCopyStep: () => [
    boolean,
    (meta: Step) => void,
    () => Step | null,
    () => void,
  ];
  useLesson: <T extends Activity>(
    lessonId: Lesson['id'],
  ) => RecordHookReturn<Records<T>['lesson']>;
  useActivity: <T extends Activity>(
    key: string,
  ) => RecordHookReturn<Records<T>['activity']>;
  useLessonMeta: (activity: Lesson) => UseMetaReturn<{ evaluation?: boolean }>;
  useLessons: (
    key: string,
    filters?: LessonsFilters,
  ) => RecordHookReturn<Records['lessons']>;
  useMyLessons: (
    filters?: LessonsFilters,
  ) => RecordHookReturn<Records['activeUserLessons']>;
  useCoaches: (user: User) => RecordHookReturn<Records['coaches']>;
  useStudents: (user: User) => RecordHookReturn<Records['students']>;
  useDispatchService: () => <T extends (...args: any) => any>(
    service: T extends ServiceType ? T : never,
  ) => (...payload: T extends (...args: infer U) => any ? U : never) => void;
  useChessboardContext: () => ChessboardContext;
};
