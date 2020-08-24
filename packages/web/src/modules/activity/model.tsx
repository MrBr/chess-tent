export const activitySchema = {
  type: 'activities',
  relationships: {
    owner: 'users',
    users: 'users',
  },
};
