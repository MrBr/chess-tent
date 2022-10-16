export class UnauthorisedMentorshipAction extends Error {
  message =
    'Unauthorised mentorship action. User can update only personal mentorship.';
  name = 'Unauthorised mentorship action';
}
