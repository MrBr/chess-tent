import { Mentorship, User } from '@chess-tent/models';

export const isMentorship = (
  mentorship: Mentorship[],
  student: User,
  mentor: User,
) =>
  mentorship.some(
    mentorship =>
      mentorship.coach.id === mentor.id && mentorship.student.id === student.id,
  );
