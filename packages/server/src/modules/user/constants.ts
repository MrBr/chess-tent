import { utils } from '@application';

const { formatAppLink } = utils;

export const DEFAULT_SIGNED_PROFILE_URL_EXPIRATION_TIME = 60 * 2; // 2 min

export const introMessagesCoach = [
  `Hi there! I am Luka, founder of Chess Tent and I am really excited to welcome you on board.`,
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
  `Would love to hear back from you.`,
];

export const introMessagesStudent = [
  `Hi there! I am Luka, founder of Chess Tent and I am really excited to welcome you on board.`,
  `Chess is more fun with a coach and we've got some of the best you at ${formatAppLink(
    '/coaches',
  )} page.`,
  `If you prefer learning on your own, find a lesson at ${formatAppLink(
    '/lessons',
  )} page.`,
  `Would love to hear back from you.`,
];

export const introMessagesInvitedStudent = [
  `Hi there! I am Luka, founder of Chess Tent and I am really excited to welcome you on board.`,
  `You can reach out to your coach at ${formatAppLink('/me/coaches')} page.`,
  `If you're interested in chess lessons take a look at ${formatAppLink(
    '/lessons',
  )} page.`,
  `Would love to hear back from you.`,
];
