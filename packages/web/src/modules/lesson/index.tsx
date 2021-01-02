import application from '@application';

import {
  addLessonChapterAction,
  updateLessonChapterAction,
  updateLessonPathAction,
  updateLessonStepAction,
} from './state/actions';
import { lessonSelector } from './state/selectors';
import DifficultyDropdown from './components/difficulty-dropdown';

application.register(() => import('./register'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));

application.state.actions.updateLessonStep = updateLessonStepAction;
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
  },
);

application.register(
  () => import('./components/editor-sidebar-stepper'),
  module => {
    application.components.Stepper = module.Stepper;
  },
);
application.register(
  () => import('./components/trainings'),
  module => {
    application.components.Trainings = module.default;
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
  () => import('./components/edit-board-toggle'),
  module => {
    application.components.EditBoardToggle = module.default;
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
