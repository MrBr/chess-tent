import { utils } from '@application';
import { Services } from '@types';

export const createActivityComment: Services['createActivityComment'] = (
  user,
  text,
) => ({
  userId: user.id,
  text,
  id: utils.generateIndex(),
});
