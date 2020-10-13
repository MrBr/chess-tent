import { Services } from '@types';
import { createChapter } from '@chess-tent/models';
import { utils, services, constants } from '@application';

const { generateIndex } = utils;
const { createStep } = services;
const { START_FEN } = constants;

export const createChapterService: Services['createChapter'] = (
  title = 'Chapter',
  steps = [createStep('variation', { position: START_FEN })],
) => {
  return createChapter(generateIndex(), title, steps);
};
