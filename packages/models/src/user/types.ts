import { Subject } from '../subject';
import { Difficulty } from '../lesson';
import { Tag } from '../tag';

export const TYPE_USER = 'users';

export enum FideTitles {
  GM = 'GM',
  IM = 'IM',
  FM = 'FM',
  NM = 'NM',
  CM = 'CM',
  I = 'I',
  II = 'II',
  III = 'III',
  IV = 'IV',
  V = 'V',
}

export interface User extends Subject {
  id: string;
  nickname: string;
  name: string;
  email: string;
  type: typeof TYPE_USER;
  password?: string;
  coach?: boolean;
  active?: boolean;
  state: {
    imageUrl?: string;
    elo?: number;
    studentEloMin?: number;
    studentEloMax?: number;
    about?: string;
    availability?: string;
    pricing?: string;
    speciality?: string;
    playingExperience?: string;
    teachingExperience?: string;
    teachingMethodology?: string;
    punchline?: string;
    lastActivity?: Date;
    languages?: string[];
    country?: string;
    fideTitle?: FideTitles;
    role?: {
      level?: Difficulty;
      tags?: Tag[];
      note?: string;
    };
  };
}

export interface CoachEloRange {
  from: number;
  to: number;
  // Used to override default toString method for Bootstrap option eventKey
  toString?: () => string;
}

export interface NormalizedUser {
  id: User['id'];
  type: User['type'];
  name: User['name'];
  active: User['active'];
  nickname: User['nickname'];
  email: User['email'];
  password?: User['password'];
  coach?: User['coach'];
  state: User['state'];
}
