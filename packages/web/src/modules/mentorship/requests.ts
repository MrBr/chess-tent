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

const myCoaches = services.createRequest<Requests['myCoaches']>(
  'GET',
  '/mentorship/coaches',
);
const myStudents = services.createRequest<Requests['myStudents']>(
  'GET',
  '/mentorship/students',
);

requests.myCoaches = myCoaches;
requests.myStudents = myStudents;
requests.mentorshipRequest = mentorshipRequest;
requests.mentorshipResolve = mentorshipResolve;
