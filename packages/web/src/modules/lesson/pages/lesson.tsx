import React from 'react';
import { components, hooks, requests } from '@application';
import { canEditLesson, isLessonPublicDocument } from '@chess-tent/models';

const { useParams, useActiveUserRecord, useLesson } = hooks;
const { Editor, Redirect } = components;

export default () => {
  const { value: user } = useActiveUserRecord();
  const { lessonId } = useParams();
  const { value: lesson } = useLesson(lessonId);

  if (!lesson) {
    return null;
  }

  if (isLessonPublicDocument(lesson) || !canEditLesson(lesson, user.id)) {
    return <Redirect to="/" />;
  }

  return <Editor lesson={lesson} save={requests.lessonUpdates} />;
};
