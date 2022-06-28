import React from 'react';
import { components, hooks, requests } from '@application';
import { canEditLesson, isLessonPublicDocument } from '@chess-tent/models';
import EditorPageHeader from '../components/editor-page-header';
import { useLessonPartialUpdates } from '../hooks/lesson';

const { useParams, useActiveUserRecord, useLesson } = hooks;
const { Editor, Redirect, Page } = components;

const PageLesson = () => {
  const { value: user } = useActiveUserRecord();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { value: lesson, meta, create } = useLesson(lessonId as string);

  const lessonStatus = useLessonPartialUpdates(lesson, (...args) => {
    if (!meta.saved && !meta.loaded) {
      // Handle new lesson case
      return create();
    }

    return requests.lessonUpdates(...args);
  });

  if (!lesson) {
    return null;
  }

  if (isLessonPublicDocument(lesson) || !canEditLesson(lesson, user.id)) {
    return <Redirect to="/" />;
  }

  return (
    <Page
      header={<EditorPageHeader lesson={lesson} lessonStatus={lessonStatus} />}
    >
      <Editor lesson={lesson} lessonStatus={lessonStatus} />
    </Page>
  );
};

export default PageLesson;
