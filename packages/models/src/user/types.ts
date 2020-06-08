export const TYPE_USER = "users";

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  type: typeof TYPE_USER;
  password: string;
}

export interface NormalizedUser {
  id: User["id"];
  type: User["type"];
  name: User["name"];
  nickname: User["nickname"];
  email: User["email"];
  password: User["password"];
}
