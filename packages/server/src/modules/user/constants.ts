import { utils } from '@application';

const { formatAppLink } = utils;

export const DEFAULT_SIGNED_PROFILE_URL_EXPIRATION_TIME = 60 * 2; // 2 min

export const introMessagesCoach = [
  `Welcome to Chess Tent, a virtual chess gym for everyone.`,
  `The best first step is to fill in your profile details at ${formatAppLink(
    '/me',
  )} page.`,
  `To start practicing create a new training room at ${formatAppLink(
    '?training=true',
  )} page.`,
  `To prepare a lesson, create a new template at ${formatAppLink(
    '/lesson/new',
  )} page.`,
  `You can easily invite your students at ${formatAppLink(
    '?invite=true',
  )} page.`,
  `We'd love to hear back from you.`,
];

export const introMessagesStudent = [
  `Welcome to Chess Tent, a virtual chess gym for everyone.`,
  `Chess is more fun with a coach and we've got some of the best you at ${formatAppLink(
    '/coaches',
  )} page.`,
  `If you prefer learning on your own, find a lesson at ${formatAppLink(
    '/lessons',
  )} page.`,
  `We'd love to hear back from you.`,
];

export const introMessagesInvitedStudent = [
  `Welcome to Chess Tent, a virtual chess gym for everyone.`,
  `You can reach out to your coach at ${formatAppLink('/me/coaches')} page.`,
  `If you're interested in chess lessons take a look at ${formatAppLink(
    '/lessons',
  )} page.`,
  `We'd love to hear back from you.`,
];

export const publicCoachFields = {
  id: 1,
  name: 1,
  nickname: 1,
  type: 1,
  'state.imageUrl': 1,
  'state.elo': 1,
  'state.studentEloMin': 1,
  'state.studentEloMax': 1,
  'state.teachingMethodology': 1,
  'state.languages': 1,
  'state.punchline': 1,
  'state.country': 1,
  'state.fideTitle': 1,
};
