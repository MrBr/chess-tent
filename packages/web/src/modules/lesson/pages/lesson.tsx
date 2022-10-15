import React from 'react';
import { components, hooks, requests, ui } from '@application';
import { canEditLesson, isLessonPublicDocument } from '@chess-tent/models';
import EditorPageHeader from '../components/editor-page-header';
import { useLessonPartialUpdates } from '../hooks/lesson';

const { useParams, useActiveUserRecord, useLesson } = hooks;
const { Editor, Redirect, Page } = components;
const { Spinner } = ui;

const PageLesson = () => {
  const { value: user } = useActiveUserRecord();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { value: lesson, meta, create } = useLesson(lessonId as string);

  const lessonStatus = useLessonPartialUpdates(lesson, (...args) => {
    if (meta.local) {
      // Handle new lesson case
      return create();
    }

    return requests.lessonUpdates(...args);
  });

  if (
    (lesson && isLessonPublicDocument(lesson)) ||
    (lesson && !canEditLesson(lesson, user.id)) ||
    meta.error
  ) {
    return <Redirect to="/" />;
  }

  if (!lesson) {
    return <Spinner animation="border" />;
  }

  return (
    <Page
      header={<EditorPageHeader lesson={lesson} lessonStatus={lessonStatus} />}
      tabbar={<></>}
    >
      <Editor lesson={lesson} lessonStatus={lessonStatus} />
    </Page>
  );
};

export default PageLesson;
