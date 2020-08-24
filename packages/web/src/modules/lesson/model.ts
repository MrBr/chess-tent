export const lessonSchema = {
  type: 'lessons',
  relationships: {
    state: {
      steps: 'steps',
      activeStep: 'steps',
    },
    owner: 'users',
  },
};
