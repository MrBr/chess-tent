import application from '@application';

import {
  addLessonChapterAction,
  updateLessonChapterAction,
  updateLessonPathAction,
  updateLessonStepAction,
} from './state/actions';
import { lessonSelector } from './state/selectors';
import DifficultyDropdown from './components/difficulty-dropdown';
import { editorContext } from './context';

application.register(() => import('./register'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));

application.state.actions.updateLessonStep = updateLessonStepAction;
application.context.editorContext = editorContext;
application.state.actions.updateLessonPath = updateLessonPathAction;
application.state.actions.updateLessonChapter = updateLessonChapterAction;
application.state.actions.addLessonChapter = addLessonChapterAction;
application.state.selectors.lessonSelector = lessonSelector;
application.components.DifficultyDropdown = DifficultyDropdown;

application.register(
  () => import('./model'),
  module => {
    application.model.lessonSchema = module.lessonSchema;
  },
);
application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useUpdateLessonStepState =
      module.useUpdateLessonStepState;
    application.hooks.useUserLessonsRecord = module.useUserLessonRecord;
    application.hooks.useLessons = module.useLessons;
    application.hooks.useUserTrainings = module.useUserTrainings;
  },
);

application.register(
  () => import('./components/editor-sidebar-stepper'),
  module => {
    application.components.Stepper = module.Stepper;
  },
);
application.register(
  () => import('./components/coach-trainings'),
  module => {
    application.components.CoachTrainings = module.default;
  },
);

application.register(
  () => import('./components/training-card'),
  module => {
    application.components.TrainingCard = module.default;
  },
);
application.register(
  () => import('./components/student-trainings'),
  module => {
    application.components.StudentTrainings = module.default;
  },
);
application.register(
  () => import('./components/chapters-dropdown'),
  module => {
    application.components.LessonChapters = module.default;
  },
);
application.register(
  () => import('./components/editor'),
  module => {
    application.components.Editor = module.default;
  },
);
application.register(
  () => import('./components/lesson-browser'),
  module => {
    application.components.LessonBrowser = module.default;
  },
);
application.register(
  () => import('./components/step-toolbox'),
  module => {
    application.components.StepToolbox = module.default;
  },
);
application.register(
  () => import('./components/step-toolbox-text'),
  module => {
    application.components.LessonToolboxText = module.default;
  },
);
application.register(
  () => import('./components/step-tag'),
  module => {
    application.components.StepTag = module.default;
  },
);
application.register(
  () => import('./components/activity-playground'),
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
