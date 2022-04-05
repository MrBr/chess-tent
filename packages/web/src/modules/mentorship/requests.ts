import { services, requests } from '@application';
import { Requests } from '@types';

const mentorshipRequest = services.createRequest<Requests['mentorshipRequest']>(
  'POST',
  '/mentorship',
);

const mentorshipResolve = services.createRequest<Requests['mentorshipResolve']>(
  'PUT',
  '/mentorship',
);

const coaches = services.createRequest<Requests['coaches']>(
  'GET',
  user => `/mentorship/${user.id}/coaches`,
);
const students = services.createRequest<Requests['students']>(
  'GET',
  user => `/mentorship/${user.id}/students`,
);

requests.coaches = coaches;
requests.students = students;
requests.mentorshipRequest = mentorshipRequest;
requests.mentorshipResolve = mentorshipResolve;
