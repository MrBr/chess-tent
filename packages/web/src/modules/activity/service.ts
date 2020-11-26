import { utils } from '@application';
import {
  Activity,
  createActivity as modelCreateActivity,
} from '@chess-tent/models';
import { Services } from '@types';

export const createActivity = <T extends Activity>(
  ...args: Parameters<Services['createActivity']>
) => modelCreateActivity(utils.generateIndex(), ...args) as T;
