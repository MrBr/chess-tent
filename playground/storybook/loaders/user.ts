import { User } from '@chess-tent/models';

export const userLoader = async () => {
  const user = {
    name: 'Test User',
    state: {
      imageUrl:
        'https://i.pinimg.com/474x/e4/56/d9/e456d9c0f7443c3534ee9bb3502c94cd.jpg',
    },
  } as User;
  return {
    user,
  };
};
