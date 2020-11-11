import { Subject } from "../subject";

export const TYPE_USER = "users";

export interface User extends Subject {
  id: string;
  nickname: string;
  name: string;
  email: string;
  type: typeof TYPE_USER;
  password: string;
  coach?: boolean;
  state: {
    imageUrl?: string;
    elo?: number;
    studentElo?: number;
    about?: string;
    availability?: string;
    pricing?: string;
    speciality?: string;
    playingExperience?: string;
    teachingExperience?: string;
    teachingMethodology?: string;
    punchline?: string;
  };
}

export interface NormalizedUser {
  id: User["id"];
  type: User["type"];
  name: User["name"];
  nickname: User["nickname"];
  email: User["email"];
  password: User["password"];
  coach?: User["coach"];
  state: User["state"];
}
