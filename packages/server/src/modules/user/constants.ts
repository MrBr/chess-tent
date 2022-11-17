import { utils } from '@application';

const { formatAppLink } = utils;

export const introMessagesCoach = [
  `Hi! I am Luka, founder of Chess Tent. I'll use this opportunity and share with you a few useful tips to get you started.`,
  `As a coach you can set up public profile by filling in the details at ${formatAppLink(
    '/me',
  )} page.`,
  `You can see all coaches at ${formatAppLink('/coaches')} page.`,
  `Templates are a great place to start, you can prepare lesson and use it later in the training room. Create a new template at ${formatAppLink(
    '/lesson/new',
  )} page.`,
  `Training room offers variety of features such as live interactive board, video conference and works very well with template chapters. Create a new training at ${formatAppLink(
    '?training=true',
  )} page.`,
  `You can easily invite your students at ${formatAppLink(
    '?invite=true',
  )} page. Once they register you'll be able to assign training to them.`,
  `Would love to hear back from you.`,
];

export const introMessagesStudent = [
  `Hi! I am Luka, founder of Chess Tent. I'll use this opportunity and share with you a few useful tips to get you started.`,
  `Are you looking for a coach? The best place to look for a coach is at ${formatAppLink(
    '/coaches',
  )} page.`,
  `If you prefer learning on your own, find yourself a lesson at ${formatAppLink(
    '/lessons',
  )} page.`,
  `Hope you'll find the platform useful, I'd love to hear your feedback.`,
];

export const introMessagesInvitedStudent = [
  `Hi! I am Luka, founder of Chess Tent. I'll use this opportunity and share with you a few useful tips to get you started.`,
  `You can reach out to your coach at ${formatAppLink('/me/coaches')} page.`,
  `If you're interested in chess lessons take a look at ${formatAppLink(
    '/lessons',
  )} page.`,
  `Would love to hear back from you.`,
];
