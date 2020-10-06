import { Services } from '@types';
import { createChapter } from '@chess-tent/models';
import { utils, services } from '@application';

const { generateIndex } = utils;
const { createStep } = services;

export const createChapterService: Services['createChapter'] = (
  title = 'Chapter',
  steps = [createStep('variation')],
) => {
  return createChapter(generateIndex(), title, steps);
};
