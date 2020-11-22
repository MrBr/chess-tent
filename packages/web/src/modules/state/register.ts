import initService from '@chess-tent/normalization';
import application, { model } from '@application';

const { normalize, denormalize, getId } = initService({
  users: model.userSchema,
  lessons: model.lessonSchema,
  activities: model.activitySchema,
  conversations: model.conversationSchema,
  messages: model.messageSchema,
  tags: model.tagSchema,
  analyses: model.analysisSchema,
  mentorship: model.mentorshipSchema,
  notifications: model.notificationsSchema,
});

application.utils.normalize = normalize;
application.utils.denormalize = denormalize;
application.utils.getEntityId = getId;
