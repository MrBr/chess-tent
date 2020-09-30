import { services, requests } from '@application';
import { User } from '@chess-tent/models';
import { DataResponse, StatusResponse } from '@types';

const mentorshipRequest = services.createRequest<
  {
    studentId: User['id'];
    coachId: User['id'];
  },
  StatusResponse
>('POST', '/mentorship');

const mentorshipResolve = services.createRequest<
  {
    studentId: User['id'];
    coachId: User['id'];
    approved: boolean;
  },
  StatusResponse
>('PUT', '/mentorship');

const coaches = services.createRequest<User, DataResponse<User[]>>(
  'GET',
  user => ({
    url: `/mentorship/:${user.id}/coaches`,
  }),
);
const students = services.createRequest<User, DataResponse<User[]>>(
  'GET',
  user => ({
    url: `/mentorship/:${user.id}/students`,
  }),
);

requests.coaches = coaches;
requests.students = students;
requests.mentorshipRequest = mentorshipRequest;
requests.mentorshipResolve = mentorshipResolve;
