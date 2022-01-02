import type { ComponentType } from 'react';
import { Activity } from '@chess-tent/models';

export interface ConferencingProps {
  activityId: Activity['id'];
}

export interface RTC {
  Conferencing: ComponentType<ConferencingProps>;
}
