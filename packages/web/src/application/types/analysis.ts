import { Analysis } from '@chess-tent/models';
import { Steps } from './steps';

export type AppAnalysis<T extends Steps = Steps> = Analysis<T>;
