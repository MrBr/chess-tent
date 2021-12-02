import { Evaluation, MoveShort } from '@types';
import { services } from '@application';

const { uciToSan } = services;

export const getBestMove = ({ variation }: Evaluation): MoveShort =>
  uciToSan(variation[0]);
export const getPonderMove = ({ variation }: Evaluation): MoveShort =>
  uciToSan(variation[1]);
