export const TYPE_USER = "users";

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  imageUrl?: string;
  type: typeof TYPE_USER;
  password: string;
  elo?: number;
  coach?: boolean;
  // Coach information
  studentElo?: number;
  about?: string;
  availability?: string;
  pricing?: string;
  speciality?: string;
  playingExperience?: string;
  teachingExperience?: string;
  teachingMethodology?: string;
  punchline?: string;
}

export interface NormalizedUser {
  id: User["id"];
  type: User["type"];
  name: User["name"];
  imageUrl?: User["imageUrl"];
  nickname: User["nickname"];
  email: User["email"];
  password: User["password"];
  elo?: User["elo"];
  coach?: User["coach"];
  studentElo?: User["studentElo"];
  about?: User["about"];
  availability?: User["availability"];
  pricing?: User["pricing"];
  speciality?: User["speciality"];
  playingExperience?: User["playingExperience"];
  teachingExperience?: User["teachingExperience"];
  teachingMethodology?: User["teachingMethodology"];
  punchline?: User["punchline"];
}
