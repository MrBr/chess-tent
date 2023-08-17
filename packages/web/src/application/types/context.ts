import React, { ReactElement, RefObject } from 'react';
import {
  Chapter,
  Lesson,
  Step,
  ZoomConnectionStatus,
  ZoomRole,
} from '@chess-tent/models';
import { Promotion } from './chess';
import { ChessboardInterface, Evaluation } from './components';

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
  promotion?: Promotion | null;
  evaluate?: boolean;
  evaluations: Record<string, Evaluation>;
  update: (state: Partial<ChessboardContext>) => void;
  board?: ChessboardInterface;
}

export interface ZoomContext {
  userSignature: string | null;
  hostUserZakToken: string | undefined;
  meetingNumber: string | undefined;
  username: string;
  password: string | null;
  role: ZoomRole;
  authCode: string | undefined;
  redirectUri: string | '';
  updateContext: Function;
  resetContext: Function;
  connectionStatus: ZoomConnectionStatus;
  zoomSDKElementRef: RefObject<HTMLElement> | null;
}

export type Context = {
  editorContext: React.Context<EditorContext>;
  zoomContext: React.Context<ZoomContext>;
};
