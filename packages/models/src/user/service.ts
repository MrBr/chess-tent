import { TYPE_USER, User } from './types';

const isUser = (entity: unknown): entity is User =>
  Object.getOwnPropertyDescriptor(entity, 'type')?.value === TYPE_USER;

export { isUser };
