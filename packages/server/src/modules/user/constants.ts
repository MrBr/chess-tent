import { utils } from '@application';

const { formatAppLink } = utils;

export const introMessagesCoach = [
  `Hi!`,
  `I am Luka, the founder of Chess Tent platform.`,
  'These are some useful tips to get you started.',
  `Set up public profile. You can do it at ${formatAppLink('/me')} page.`,
  `Templates are a great place to start, you can prepare your lesson chapters there and use it later in the training. Create new template at ${formatAppLink(
    '/lesson/new',
  )} page.`,
  `If you already have students you can start a training. Training room offers variety of features such as live interactive board, video conference and works very well with template chapters. Create new training from the dashboard.`,
  `Feel free to let me know if you have any questions.`,
];

export const introMessagesStudent = [
  `Hi!`,
  `I am Luka, the founder of Chess Tent platform.`,
  "Are you looking for a coach? Let's schedule an online call and I'll help you find the best one for you.",
  `If you prefer learning on your own, find yourself a lesson at ${formatAppLink(
    '/lessons',
  )} page.`,
  `Feel free to let me know if you have any questions.`,
];