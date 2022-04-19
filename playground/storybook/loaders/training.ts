import { User } from '@chess-tent/models';

import { importWebModule } from '../utils';

export const trainingLoader = async () => {
  const lessonServices = await importWebModule(
    () => import('@chess-tent/web/src/modules/lesson/service'),
  );
  const user = {
    name: 'Test User',
    state: {
      imageUrl:
        'https://i.pinimg.com/474x/e4/56/d9/e456d9c0f7443c3534ee9bb3502c94cd.jpg',
    },
  } as User;
  const students = [
    {
      name: 'Student One',
      state: {
        imageUrl:
          'https://static.wikia.nocookie.net/coolcat6381/images/6/67/Coolcatlovesyou.jpeg',
      },
    },
    {
      name: 'Student Two',
      state: {
        imageUrl:
          'https://i.pinimg.com/564x/7f/96/e5/7f96e540d9f61bf9fa0487a4190a0286.jpg',
      },
    },
    {
      name: 'Student Three',
      state: {
        imageUrl:
          'https://64.media.tumblr.com/1f7177089c7be0e2440fbe59bda6eeb3/06da5e624ae8f22e-d5/s400x600/3a04f16e654fe287db8779222ac99e46a7f27be3.jpg',
      },
    },
  ] as User[];
  const lesson = lessonServices.createNewLesson(user, []);
  return {
    training: lessonServices.createLessonActivity(
      lesson,
      user,
      { date: new Date().toUTCString() },
      {},
      students,
    ),
  };
};
