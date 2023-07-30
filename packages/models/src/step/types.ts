import { Subject } from '../subject';
import { User } from '../user';
import { Tag } from '../tag';
import { Difficulty } from '../lesson';

export type StepType = 'description' | 'variation' | 'move' | 'exercise';

export const TYPE_STEP = 'steps';

export interface Step<T extends {} = {}, K extends StepType = StepType> {
  id: string;
  docId?: string;
  owner?: User;
  type: typeof TYPE_STEP;
  stepType: K;
  difficulty?: Difficulty;
  tags?: Tag[];
  users?: User[];
  published?: boolean;
  state: { steps: Step[] } & T;
}

export interface NormalizedStep {
  id: Step['id'];
  docId?: Step['docId'];
  owner: User['id'];
  type: Step['type'];
  stepType: Step['stepType'];
  difficulty: Step['difficulty'];
  tags: Step['tags'][];
  published?: Step['published'];
  users?: User['id'][];
  state: Step['state'] & {
    steps: Step['id'][];
  };
}

// Step root shape has steps array in the state but it doesn't have to be a step itself.
export interface StepRoot<T extends Step = Step> extends Subject {
  state: { steps: T[] };
}
