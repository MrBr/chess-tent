import React, { ReactElement } from 'react';
import { Chapter, Lesson, Step } from '@chess-tent/models';
import { Promotion } from './chess';
import { Evaluation } from './components';

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

export interface ChessboardContext {
  renderPrompt?: (close: () => void) => ReactElement;
  promotion?: Promotion;
  evaluate?: boolean;
  evaluations: Record<string, Evaluation>;
  update: (state: Partial<ChessboardContext>) => void;
}

export type Context = {
  editorContext: React.Context<EditorContext>;
};
