export const TYPE_USER = "users";

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  imageUrl?: string;
  type: typeof TYPE_USER;
  password: string;
  coach?: boolean;
}

export interface NormalizedUser {
  id: User["id"];
  type: User["type"];
  name: User["name"];
  imageUrl?: User["imageUrl"];
  nickname: User["nickname"];
  email: User["email"];
  password: User["password"];
  coach?: User["coach"];
}
