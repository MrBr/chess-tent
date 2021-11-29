import { Chapter, TYPE_CHAPTER } from './types';
import { Step, updateNestedStep } from '../step';

const isChapter = (entity: unknown): entity is Chapter =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_CHAPTER;

const updateChapterStep = updateNestedStep;

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
