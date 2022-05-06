import { useContext } from 'react';
import { editorContext } from '../context';

export const useEditor = () => {
  const context = useContext(editorContext);
  if (!context) {
    throw new Error('Component using Editor context not in the Editor scope.');
  }
  return context;
};
