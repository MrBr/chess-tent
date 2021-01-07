import { Chapter, TYPE_CHAPTER } from './types';
import { Step } from '../step';
import { SubjectPath, updateSubjectValueAt } from '../subject';

const isChapter = (entity: unknown): entity is Chapter =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_CHAPTER;

const updateChapterStep = (
  chapter: Chapter,
  patch: Partial<Step>,
  path: SubjectPath,
) => updateSubjectValueAt(chapter, path, patch);

const createChapter = (
  id: string,
  title = 'Chapter',
  steps: Step[],
): Chapter => ({
  id,
  type: TYPE_CHAPTER,
  state: { steps, title },
});

export { isChapter, createChapter, updateChapterStep };
