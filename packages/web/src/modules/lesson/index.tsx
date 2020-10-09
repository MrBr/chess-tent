import application from '@application';

import {
  addLessonChapterAction,
  updateLessonAction,
  updateLessonChapterAction,
  updateLessonPathAction,
  updateLessonStepAction,
} from './state/actions';
import { lessonSelector } from './state/selectors';

application.register(() => import('./register'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));

application.state.actions.updateLessonStep = updateLessonStepAction;
application.state.actions.updateLessonPath = updateLessonPathAction;
application.state.actions.updateLessonChapter = updateLessonChapterAction;
application.state.actions.addLessonChapter = addLessonChapterAction;
application.state.actions.updateLesson = updateLessonAction;
application.state.selectors.lessonSelector = lessonSelector;

application.register(
  () => import('./model'),
  module => {
    application.model.lessonSchema = module.lessonSchema;
  },
);
application.register(
  () => import('./state/hooks'),
  module => {
    application.hooks.useUpdateLessonStepState =
      module.useUpdateLessonStepState;
    application.hooks.useUserLessonsRecord = module.useUserLessonRecord;
  },
);

application.register(
  () => import('./components/stepper'),
  module => {
    application.components.Stepper = module.Stepper;
    application.components.StepperStepContainer = module.StepperStepContainer;
  },
);
application.register(
  () => import('./components/editor'),
  module => {
    application.components.Editor = module.default;
  },
);
application.register(
  () => import('./components/lessons'),
  module => {
    application.components.Lessons = module.default;
  },
);
application.register(
  () => import('./components/step-toolbox'),
  module => {
    application.components.StepToolbox = module.default;
    application.components.LessonToolboxText = module.ToolboxText;
  },
);
application.register(
  () => import('./components/step-tag'),
  module => {
    application.components.StepTag = module.default;
  },
);
application.register(
  () => import('./components/playground'),
  module => {
    application.components.LessonPlayground = module.default;
  },
);
application.register(
  () => import('./components/step-move'),
  module => {
    application.components.StepMove = module.default;
  },
);
