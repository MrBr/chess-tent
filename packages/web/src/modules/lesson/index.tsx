import application from '@application';

import { lessonSelector } from './state/selectors';
import DifficultyDropdown from './components/difficulty-dropdown';
import { editorContext } from './context';

application.register(() => import('./state/reducer'));
application.register(() => import('./state/middleware'));
application.register(() => import('./routes'));
application.register(() => import('./requests'));

application.context.editorContext = editorContext;
application.state.selectors.lessonSelector = lessonSelector;
application.components.DifficultyDropdown = DifficultyDropdown;

application.register(
  () => import('./model'),
  module => {
    application.model.lessonSchema = module.lessonSchema;
  },
);
application.register(
  () => import('./search/lessons'),
  module => {
    application.services.registerSearchable(module.LessonsSearchable);
  },
);
application.register(
  () => import('./search/studies'),
  module => {
    application.services.registerSearchable(module.StudiesSearchable);
  },
);
application.register(
  () => import('./hooks/record'),
  module => {
    application.hooks.useLesson = module.useLesson;
    application.hooks.useLessons = module.useLessons;
    application.hooks.useMyLessons = module.useMyLessons;
  },
);
application.register(
  () => import('./hooks/lesson'),
  module => {
    application.hooks.useLessonMeta = module.useLessonMeta;
    application.hooks.useUpdateLessonStepState =
      module.useUpdateLessonStepState;
    application.hooks.useOpenTemplate = module.useOpenTemplate;
    application.hooks.useOpenLesson = module.useOpenLesson;
  },
);
application.register(
  () => import('./hooks/activity'),
  module => {
    application.hooks.useUserScheduledTrainings =
      module.useUserScheduledTrainings;
    application.hooks.usePromptNewTrainingModal =
      module.usePromptNewTrainingModal;
    application.hooks.useUserTrainings = module.useUserTrainings;
    application.hooks.useOpenTraining = module.useOpenTraining;
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
  () => import('./components/scheduled-trainings'),
  module => {
    application.components.ScheduledTrainings = module.default;
  },
);

application.register(
  () => import('./components/training-card'),
  module => {
    application.components.TrainingCard = module.default;
  },
);

application.register(
  () => import('./components/lesson-card'),
  module => {
    application.components.LessonCard = module.default;
  },
);

application.register(
  () => import('./components/training-scheduled-card'),
  module => {
    application.components.TrainingScheduledCard = module.default;
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
  () => import('./components/template-browser'),
  module => {
    application.components.LessonTemplates = module.default;
  },
);
application.register(
  () => import('./components/editor-sidebar-step-toolbox'),
  module => {
    application.components.EditorStepToolbox = module.default;
  },
);
application.register(
  () => import('./components/editor-sidebar-step-container'),
  module => {
    application.components.EditorSidebarStepContainer = module.default;
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
  () => import('./components/activity-playground-card'),
  module => {
    application.components.LessonPlaygroundCard = module.default;
  },
);
application.register(
  () => import('./components/activity-playground-content'),
  module => {
    application.components.LessonPlaygroundContent = module.default;
  },
);
application.register(
  () => import('./components/step-move'),
  module => {
    application.components.StepMove = module.default;
  },
);
application.register(
  () => import('./components/piece-icon'),
  module => {
    application.components.PieceIcon = module.default;
  },
);
