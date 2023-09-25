import { NormalizedUser } from '@chess-tent/models';
import { COACH_REQUIRED_STATE } from '@chess-tent/types';
import { AppDocument } from '@types';
import { FilterQuery } from 'mongoose';

export const withCoachPublicInfo = (
  infoQuery: FilterQuery<AppDocument<NormalizedUser>>,
) => {
  // Check all required public info
  COACH_REQUIRED_STATE.forEach(key => {
    infoQuery[`state.${key}`] = infoQuery[`state.${key}`] || {
      $exists: true,
      $ne: '',
    };
  });
};
