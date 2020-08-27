export const lessonSchema = {
  type: 'lessons',
  relationships: {
    state: {
      steps: 'steps',
    },
    owner: 'users',
  },
};
