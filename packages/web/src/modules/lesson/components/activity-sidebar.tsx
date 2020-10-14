import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';
import styled from '@emotion/styled';

const { LessonChapters } = components;
const { Container } = ui;

export default styled(({ className, lesson, chapter, children }) => {
  return (
    <div className={className}>
      <LessonChapters
        chapters={lesson.state.chapters}
        activeChapter={chapter}
      />
      <Container className="step-content">{children}</Container>
    </div>
  );
})({
  '.step-content': {
    marginTop: '7em',
  },
}) as Components['LessonPlaygroundSidebar'];
