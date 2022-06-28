import React, { useEffect, useMemo, useCallback } from 'react';
import { Chapter, LessonActivity, User } from '@chess-tent/models';
import { hooks, records } from '@application';
import {
  ActivityFilters,
  GetRequestFetchArgs,
  Hooks,
  Records,
  Requests,
} from '@types';
import { userTrainings } from '../record';
import TrainingAssign from '../components/training-assign';
import { ActivityData } from '../components/activity-form';
import { createLessonActivity, createNewLesson } from '../service';

const { useRecordInit, useHistory, usePrompt } = hooks;
const { isInitialized } = records;

export const useUserTrainings: Hooks['useUserTrainings'] = (user: User) => {
  const record = useRecordInit(userTrainings, `trainings-${user.id}`);

  const filters: ActivityFilters = useMemo(
    () => ({
      users: user.id,
      date: false,
    }),
    [user.id],
  );

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load(filters);
    // eslint-disable-next-line
  }, [filters]);

  return record;
};

export const useUserScheduledTrainings: Hooks['useUserScheduledTrainings'] = (
  user,
  initialFilters,
) => {
  const record = useRecordInit(
    userTrainings as Records['userScheduledTrainings'],
    `scheduled-trainings-${user.id}`,
  );

  const filters: GetRequestFetchArgs<Requests['scheduledTrainings']> = useMemo(
    () => ({
      users: user.id,
      date: { from: new Date() },
      ...initialFilters,
    }),
    // eslint-disable-next-line
    [user.id],
  );

  useEffect(() => {
    if (isInitialized(record)) {
      return;
    }
    record.load(filters);
    // eslint-disable-next-line
  }, []);

  return record;
};

export const usePromptNewTrainingModal = () => {
  return usePrompt(close => <TrainingAssign close={close} />);
};

export const useOpenTraining = () => {
  const history = useHistory();

  return useCallback(
    (training: LessonActivity) => {
      history.push(`/activity/${training.id}`);
    },
    [history],
  );
};

export const useCreateNewTraining = (user: User) => {
  const userTrainings = useUserTrainings(user);
  const userScheduledTrainings = useUserScheduledTrainings(user);
  const history = useHistory();

  return useCallback(
    async (
      data: ActivityData,
      chapters: Chapter[],
      options: { redirect?: boolean } = { redirect: true },
    ) => {
      const { new: newTraining } = data.date
        ? userScheduledTrainings
        : userTrainings;
      const lesson = createNewLesson(user, chapters);
      const training = createLessonActivity(
        lesson,
        user,
        { title: data.title, date: data.date, weekly: data.weekly },
        {},
        data.students,
        data.coaches,
      );
      await newTraining(training);
      options.redirect && history.push(`/activity/${training.id}`);
    },
    [userScheduledTrainings, userTrainings, user, history],
  );
};
