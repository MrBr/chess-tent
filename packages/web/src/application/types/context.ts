import React from 'react';
import { Chapter, Lesson, Step } from '@chess-tent/models';

export type EditorContext =
  | {
      lesson: Lesson;
      chapter: Chapter;
      step: Step;

      setActiveChapter: (chapter: Chapter) => void;
      updateChapter: (chapter: Chapter) => void;
      removeChapter: (chapter: Chapter) => void;

      setActiveStep: (step: Step) => void;
      updateStep: (step: Step) => void;
      removeStep: (step: Step) => void;
    }
  | undefined;

export type Context = {
  editorContext: React.Context<EditorContext>;
};
