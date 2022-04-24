import React from 'react';
import { components, hooks, requests } from '@application';
import { canEditLesson, isLessonPublicDocument } from '@chess-tent/models';
import EditorPageHeader from '../components/editor-page-header';

const { useParams, useActiveUserRecord, useLesson } = hooks;
const { Editor, Redirect, Page } = components;

const PageLesson = () => {
  const { value: user } = useActiveUserRecord();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { value: lesson } = useLesson(lessonId as string);

  if (!lesson) {
    return null;
  }

  if (isLessonPublicDocument(lesson) || !canEditLesson(lesson, user.id)) {
    return <Redirect to="/" />;
  }

  return (
    <Page header={<EditorPageHeader lesson={lesson} />}>
      <Editor lesson={lesson} save={requests.lessonUpdates} />
    </Page>
  );
};

export default PageLesson;
