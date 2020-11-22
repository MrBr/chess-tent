import { TYPE_MENTORSHIP, TYPE_USER, User } from '@chess-tent/models';

export const mentorshipSchema = {
  type: TYPE_MENTORSHIP,
  relationships: {
    coach: TYPE_USER,
    student: TYPE_USER,
  },
  id: ({ coach, student }: { coach: User; student: User }) =>
    `${coach.id || coach}-${student.id || student}`,
};
