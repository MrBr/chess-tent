import { useEffect, useMemo } from 'react';
import { hooks } from '@application';
import { createNewLesson } from '../service';
import { lesson as lessonRecord } from '../record';

const { useActiveUserRecord, useHistory, useRecordInit } = hooks;

const NewLesson = () => {
  const { value: user } = useActiveUserRecord();

  // eslint-disable-next-line
  const tempLesson = useMemo(() => createNewLesson(user), []);
  const { update, value: lesson } = useRecordInit(
    lessonRecord,
    'lesson' + tempLesson.id,
  );

  const history = useHistory();

  useEffect(() => {
    update(tempLesson, { loaded: true, local: true });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!lesson) {
      return;
    }
    const activeStep =
      new URLSearchParams(history.location.search).get('activeStep') ||
      lesson.state.chapters[0].state.steps[0].id;
    history.replace(`/lesson/${lesson.id}?activeStep=${activeStep}`);
  }, [history, lesson]);

  return null;
};

export default NewLesson;
