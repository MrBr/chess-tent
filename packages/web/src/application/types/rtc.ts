import type { ComponentType } from 'react';
import { Activity } from '@chess-tent/models';

export type ConferencingProps = {
  activityId: Activity['id'];
} & Partial<{
  iceServerUrls: string[];
  mediaConstraints: { video: boolean; audio: boolean };
}>;

export interface RTC {
  Conferencing: ComponentType<ConferencingProps>;
}
