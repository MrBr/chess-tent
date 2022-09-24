import { User } from '@chess-tent/models';

export const COACH_REQUIRED_STATE: (keyof User['state'])[] = [
  'imageUrl',
  'pricing',
  'languages',
  'punchline',
  'about',
  'studentEloMin',
  'studentEloMax',
  'elo',
];
