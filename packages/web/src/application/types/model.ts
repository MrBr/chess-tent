export interface Schema {
  type: string;
  relationships: {
    [key: string]: string | {};
  };
}
export type Model = {
  lessonSchema: Schema;
  activitySchema: Schema;
  notificationSchema: Schema;
  stepSchema: Schema;
  conversationSchema: Schema;
  messageSchema: Schema;
  userSchema: Schema;
  tagSchema: Schema;
  analysisSchema: Schema;
  mentorshipSchema: Schema;
};
