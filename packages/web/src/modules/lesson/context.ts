import { createContext } from 'react';
import { EditorContext } from '@types';

export const editorContext = createContext<EditorContext | undefined>(
  undefined,
);

export const EditorProvider = editorContext.Provider;
